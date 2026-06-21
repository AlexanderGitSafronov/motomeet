import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X, Image as ImageIcon, Flag, MapPin, CalendarDays, Clock, Sparkles, Loader2, Check, Route as RouteIcon, ArrowDown,
} from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { IconButton } from '@/components/ui/IconButton'
import { Input, Textarea, FieldLabel } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FilterChips } from '@/components/ui/FilterChips'
import { LiveMap } from '@/components/map/LiveMap'
import { img } from '@/data/images'
import { useAppStore } from '@/store/useAppStore'
import { searchPlaces, routeBetween, type Place, type RouteResult } from '@/lib/geocode'
import { formatKm } from '@/lib/format'
import type { EventCategory } from '@/data/types'

const CAT: Record<EventCategory, { label: string; cover: string }> = {
  tour: { label: 'Груповий тур', cover: img.coastalRide },
  rally: { label: 'Мото-ралі', cover: img.alpineRally },
  track: { label: 'Трек-день', cover: img.trackRace },
  meetup: { label: 'Зустріч', cover: img.neonCity },
}

/** Tours and rallies are journeys (from → to); tracks and meetups are single spots. */
const isJourney = (c: EventCategory) => c === 'tour' || c === 'rally'

function fmtDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  if (h && m) return `${h} год ${m} хв`
  if (h) return `${h} год`
  return `${m} хв`
}

interface PlaceValue {
  text: string
  place: Place | null
}
const EMPTY: PlaceValue = { text: '', place: null }

/** A location input with debounced OpenStreetMap autocomplete. */
function PlaceField({
  label,
  placeholder,
  icon = <MapPin size={18} />,
  onChange,
}: {
  label: string
  placeholder: string
  icon?: React.ReactNode
  onChange: (v: PlaceValue) => void
}) {
  const [query, setQuery] = useState('')
  const [place, setPlace] = useState<Place | null>(null)
  const [suggestions, setSuggestions] = useState<Place[]>([])
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)
  const justPicked = useRef(false)

  useEffect(() => {
    if (justPicked.current) {
      justPicked.current = false
      return
    }
    const q = query.trim()
    if (q.length < 3) {
      setSuggestions([])
      setSearching(false)
      return
    }
    setSearching(true)
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      const res = await searchPlaces(q, ctrl.signal)
      setSuggestions(res)
      setSearching(false)
      setOpen(true)
    }, 350)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [query])

  const pick = (p: Place) => {
    justPicked.current = true
    setPlace(p)
    setQuery(p.short)
    setOpen(false)
    setSuggestions([])
    onChange({ text: p.short, place: p })
  }

  return (
    <div className="relative">
      <FieldLabel>{label}</FieldLabel>
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          if (place) setPlace(null)
          onChange({ text: e.target.value, place: null })
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        leftIcon={icon}
        rightIcon={
          searching ? (
            <Loader2 size={16} className="animate-spin text-text-muted" />
          ) : place ? (
            <Check size={16} className="text-success" />
          ) : undefined
        }
        placeholder={placeholder}
        aria-label={label}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-30 mt-1.5 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-surface shadow-card">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => pick(s)}
                className="flex w-full items-start gap-2.5 border-b border-border px-3.5 py-2.5 text-left last:border-0 hover:bg-surface-2"
              >
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-text">{s.short}</span>
                  <span className="block truncate text-xs text-text-muted">{s.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function CreateEventScreen() {
  const navigate = useNavigate()
  const pushToast = useAppStore((s) => s.pushToast)
  const createEvent = useAppStore((s) => s.createEvent)

  const [name, setName] = useState('Недільний світанковий заїзд')
  const [description, setDescription] = useState(
    'Ранковий заїзд, щоб зустріти схід сонця над озером. Спокійний темп, зупинка на каву ☕'
  )
  const [category, setCategory] = useState<EventCategory>('tour')
  const [date, setDate] = useState('2026-07-06')
  const [time, setTime] = useState('07:00')

  const journey = isJourney(category)

  // single-spot location (track / meetup)
  const [single, setSingle] = useState<PlaceValue>(EMPTY)
  // journey endpoints (tour / rally)
  const [from, setFrom] = useState<PlaceValue>(EMPTY)
  const [to, setTo] = useState<PlaceValue>(EMPTY)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [routing, setRouting] = useState(false)

  // Start from a clean slate whenever the category (and thus the location UI) changes.
  useEffect(() => {
    setSingle(EMPTY)
    setFrom(EMPTY)
    setTo(EMPTY)
    setRoute(null)
  }, [category])

  // Plot the road route as soon as both endpoints are chosen.
  useEffect(() => {
    if (!journey || !from.place || !to.place) {
      setRoute(null)
      return
    }
    let cancelled = false
    setRouting(true)
    const ctrl = new AbortController()
    routeBetween(from.place, to.place, ctrl.signal).then((r) => {
      if (!cancelled) {
        setRoute(r)
        setRouting(false)
      }
    })
    return () => {
      cancelled = true
      ctrl.abort()
    }
  }, [journey, from.place, to.place])

  const publish = () => {
    if (!name.trim()) {
      pushToast({ title: 'Спершу вкажіть назву події', icon: 'info' })
      return
    }
    const base = {
      title: name.trim(),
      category,
      categoryLabel: CAT[category].label,
      cover: CAT[category].cover,
      date: `${date}T${time}:00`,
      description: description.trim(),
    }

    if (journey) {
      if (!from.place || !to.place) {
        pushToast({ title: 'Оберіть старт і фініш зі списку', icon: 'info' })
        return
      }
      createEvent({
        ...base,
        location: `${from.place.short} → ${to.place.short}`,
        city: from.place.city,
        pos: [from.place.lat, from.place.lng],
        routePath: route?.path,
        distanceKm: route?.distanceKm,
        duration: route ? fmtDuration(route.durationMin) : undefined,
      })
      pushToast({ title: `«${base.title}» опубліковано 🎉`, body: 'Маршрут прокладено й позначено на карті', icon: 'success' })
      navigate('/events')
      return
    }

    if (!single.text.trim()) {
      pushToast({ title: 'Вкажіть локацію події', icon: 'info' })
      return
    }
    createEvent({
      ...base,
      location: single.place?.short ?? single.text.trim(),
      city: single.place?.city ?? single.text.trim().split(',')[0],
      pos: single.place ? [single.place.lat, single.place.lng] : undefined,
    })
    pushToast({
      title: `«${base.title}» опубліковано 🎉`,
      body: single.place ? 'Подію позначено на карті' : 'Райдери поруч отримали сповіщення',
      icon: 'success',
    })
    navigate('/events')
  }

  return (
    <div className="relative h-full overflow-hidden bg-bg">
      <div className="h-full overflow-y-auto no-scrollbar pb-28">
        <div className="mx-auto w-full max-w-app">
          <div className="pt-safe">
            <StatusBar />
          </div>
          {/* Header */}
          <div className="flex items-center px-4 py-2">
            <IconButton label="Закрити" variant="surface" onClick={() => navigate(-1)} className="border-border bg-transparent">
              <X size={20} />
            </IconButton>
            <h1 className="flex-1 text-center text-lg font-bold text-text">Створення події</h1>
            <span className="w-11" />
          </div>

          <div className="px-5">
            {/* Cover (reflects category) */}
            <div className="relative h-40 w-full overflow-hidden rounded-lg">
              <img src={CAT[category].cover} alt="Обкладинка події" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/25" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-semibold text-white">
                {CAT[category].label}
              </span>
              <button
                onClick={() => pushToast({ title: 'Обкладинку оновлено за категорією', icon: 'info' })}
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-semibold text-white"
              >
                <ImageIcon size={14} /> Змінити обкладинку
              </button>
            </div>

            {/* Name */}
            <div className="mt-5">
              <FieldLabel>Назва події</FieldLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} leftIcon={<Flag size={18} />} placeholder="Назвіть свій заїзд" aria-label="Назва події" />
            </div>

            {/* Description */}
            <div className="mt-4">
              <FieldLabel>Опис</FieldLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Який план?" aria-label="Опис" />
            </div>

            {/* Category */}
            <div className="mt-4">
              <FieldLabel>Категорія</FieldLabel>
              <FilterChips<EventCategory>
                options={[
                  { value: 'tour', label: 'Тур' },
                  { value: 'rally', label: 'Ралі' },
                  { value: 'track', label: 'Трек' },
                  { value: 'meetup', label: 'Зустріч' },
                ]}
                value={category}
                onChange={setCategory}
              />
            </div>

            {/* Location — single spot, or a route for journeys */}
            {journey ? (
              <div className="mt-4 space-y-3">
                {/* key forces a fresh field when switching tour↔rally so stale text clears */}
                <PlaceField
                  key={`from-${category}`}
                  label="Звідки"
                  placeholder="Точка старту…"
                  icon={<MapPin size={18} className="text-success" />}
                  onChange={setFrom}
                />
                <div className="flex justify-center text-text-muted">
                  <ArrowDown size={16} />
                </div>
                <PlaceField
                  key={`to-${category}`}
                  label="Куди"
                  placeholder="Точка фінішу…"
                  icon={<Flag size={18} className="text-primary" />}
                  onChange={setTo}
                />

                {from.place && to.place && (
                  <div className="relative z-0 h-44 overflow-hidden rounded-md border border-border isolate">
                    {routing ? (
                      <div className="grid h-full place-items-center bg-surface-2 text-text-muted">
                        <span className="inline-flex items-center gap-2 text-sm">
                          <Loader2 size={16} className="animate-spin" /> Прокладаємо маршрут…
                        </span>
                      </div>
                    ) : (
                      <LiveMap
                        interactive={false}
                        showRiders={false}
                        showEvents={false}
                        showClubs={false}
                        center={[from.place.lat, from.place.lng]}
                        zoom={11}
                        routePath={route?.path}
                        fitTo={route?.path}
                      />
                    )}
                  </div>
                )}
                {route && !routing && (
                  <p className="flex items-center gap-2 text-sm text-text-secondary">
                    <RouteIcon size={16} className="text-primary" />
                    Маршрут ≈ {formatKm(route.distanceKm)} · {fmtDuration(route.durationMin)}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-4">
                <PlaceField
                  key={`single-${category}`}
                  label="Локація"
                  placeholder="Звідки старт? Почніть вводити місто…"
                  onChange={setSingle}
                />
                {single.place && (
                  <div className="relative z-0 mt-3 h-36 overflow-hidden rounded-md border border-border isolate">
                    <LiveMap
                      interactive={false}
                      showRiders={false}
                      showEvents={false}
                      showClubs={false}
                      center={[single.place.lat, single.place.lng]}
                      zoom={13}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Date + time */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Дата</FieldLabel>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} leftIcon={<CalendarDays size={18} />} aria-label="Дата" />
              </div>
              <div>
                <FieldLabel>Час</FieldLabel>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} leftIcon={<Clock size={18} />} aria-label="Час" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publish bar */}
      <div className="absolute inset-x-0 bottom-0 z-20 glass px-5 pb-safe pt-3">
        <div className="mx-auto max-w-app pb-3">
          <Button block size="lg" onClick={publish} leftIcon={<Sparkles size={18} />}>
            Опублікувати подію
          </Button>
        </div>
      </div>
    </div>
  )
}
