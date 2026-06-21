import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Image as ImageIcon, Flag, MapPin, CalendarDays, Clock, Sparkles, Loader2, Check } from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { IconButton } from '@/components/ui/IconButton'
import { Input, Textarea, FieldLabel } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FilterChips } from '@/components/ui/FilterChips'
import { LiveMap } from '@/components/map/LiveMap'
import { img } from '@/data/images'
import { useAppStore } from '@/store/useAppStore'
import { searchPlaces, type Place } from '@/lib/geocode'
import type { EventCategory } from '@/data/types'

const CAT: Record<EventCategory, { label: string; cover: string }> = {
  tour: { label: 'Груповий тур', cover: img.coastalRide },
  rally: { label: 'Мото-ралі', cover: img.alpineRally },
  track: { label: 'Трек-день', cover: img.trackRace },
  meetup: { label: 'Зустріч', cover: img.neonCity },
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

  // ---- location with geocoding ----
  const [locQuery, setLocQuery] = useState('')
  const [place, setPlace] = useState<Place | null>(null)
  const [suggestions, setSuggestions] = useState<Place[]>([])
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)
  const justSelected = useRef(false)

  useEffect(() => {
    if (justSelected.current) {
      justSelected.current = false
      return
    }
    const q = locQuery.trim()
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
  }, [locQuery])

  const selectPlace = (p: Place) => {
    justSelected.current = true
    setPlace(p)
    setLocQuery(p.short)
    setOpen(false)
    setSuggestions([])
  }

  const publish = () => {
    if (!name.trim()) {
      pushToast({ title: 'Спершу вкажіть назву події', icon: 'info' })
      return
    }
    if (!locQuery.trim()) {
      pushToast({ title: 'Вкажіть локацію події', icon: 'info' })
      return
    }
    createEvent({
      title: name.trim(),
      category,
      categoryLabel: CAT[category].label,
      cover: CAT[category].cover,
      date: `${date}T${time}:00`,
      location: place?.short ?? locQuery.trim(),
      city: place?.city ?? locQuery.trim().split(',')[0],
      description: description.trim(),
      pos: place ? [place.lat, place.lng] : undefined,
    })
    pushToast({
      title: `«${name.trim()}» опубліковано 🎉`,
      body: place ? 'Подію позначено на карті' : 'Райдери поруч отримали сповіщення',
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

            {/* Location with geocoding */}
            <div className="relative mt-4">
              <FieldLabel>Локація</FieldLabel>
              <Input
                value={locQuery}
                onChange={(e) => {
                  setLocQuery(e.target.value)
                  setPlace(null)
                }}
                onFocus={() => suggestions.length && setOpen(true)}
                leftIcon={<MapPin size={18} />}
                rightIcon={
                  searching ? (
                    <Loader2 size={16} className="animate-spin text-text-muted" />
                  ) : place ? (
                    <Check size={16} className="text-success" />
                  ) : undefined
                }
                placeholder="Звідки старт? Почніть вводити місто…"
                aria-label="Локація"
                autoComplete="off"
              />
              {open && suggestions.length > 0 && (
                <ul className="absolute z-30 mt-1.5 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-surface shadow-card">
                  {suggestions.map((s, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => selectPlace(s)}
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
              {/* Map preview of the chosen place */}
              {place && (
                <div className="mt-3 h-36 overflow-hidden rounded-md border border-border">
                  <div className="h-full w-full isolate">
                    <LiveMap
                      interactive={false}
                      showRiders={false}
                      showEvents={false}
                      showClubs={false}
                      center={[place.lat, place.lng]}
                      zoom={13}
                    />
                  </div>
                </div>
              )}
            </div>

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
