import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Image as ImageIcon, Flag, MapPin, CalendarDays, Clock, Sparkles } from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { IconButton } from '@/components/ui/IconButton'
import { Input, Textarea, FieldLabel } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FilterChips } from '@/components/ui/FilterChips'
import { img } from '@/data/images'
import { useAppStore } from '@/store/useAppStore'
import type { EventCategory } from '@/data/types'

export function CreateEventScreen() {
  const navigate = useNavigate()
  const pushToast = useAppStore((s) => s.pushToast)

  const [name, setName] = useState('Недільний світанковий заїзд')
  const [description, setDescription] = useState(
    'Ранковий заїзд, щоб зустріти схід сонця над озером. Спокійний темп, зупинка на каву ☕'
  )
  const [category, setCategory] = useState<EventCategory>('tour')
  const [location, setLocation] = useState('Англійський сад, Мюнхен')
  const [date, setDate] = useState('2026-07-06')
  const [time, setTime] = useState('07:00')

  const publish = () => {
    if (!name.trim()) {
      pushToast({ title: 'Спершу вкажіть назву події', icon: 'info' })
      return
    }
    pushToast({ title: `«${name}» опубліковано 🎉`, body: 'Райдери поруч отримали сповіщення', icon: 'success' })
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
            {/* Cover */}
            <div className="relative h-40 w-full overflow-hidden rounded-lg">
              <img src={img.trackRace} alt="Event cover" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/25" />
              <button className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-semibold text-white">
                <ImageIcon size={14} /> Змінити обкладинку
              </button>
            </div>

            {/* Name */}
            <div className="mt-5">
              <FieldLabel>Назва події</FieldLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<Flag size={18} />}
                placeholder="Назвіть свій заїзд"
                aria-label="Назва події"
              />
            </div>

            {/* Description */}
            <div className="mt-4">
              <FieldLabel>Опис</FieldLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Який план?"
                aria-label="Опис"
              />
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

            {/* Location */}
            <div className="mt-4">
              <FieldLabel>Локація</FieldLabel>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                leftIcon={<MapPin size={18} />}
                placeholder="Звідки старт?"
                aria-label="Локація"
              />
            </div>

            {/* Date + time */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Дата</FieldLabel>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  leftIcon={<CalendarDays size={18} />}
                  aria-label="Дата"
                />
              </div>
              <div>
                <FieldLabel>Час</FieldLabel>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  leftIcon={<Clock size={18} />}
                  aria-label="Час"
                />
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
