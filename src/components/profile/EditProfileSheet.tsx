import { useState } from 'react'
import { User, Bike, MapPin } from 'lucide-react'
import { Sheet } from '@/components/ui/Sheet'
import { Input, FieldLabel } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/useAppStore'
import { useCurrentUser } from '@/store/useCurrentUser'

export function EditProfileSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useCurrentUser()
  const updateProfile = useAppStore((s) => s.updateProfile)
  const pushToast = useAppStore((s) => s.pushToast)

  const [name, setName] = useState(user.name)
  const [bike, setBike] = useState(user.bike)
  const [location, setLocation] = useState(user.location ?? '')

  const save = () => {
    updateProfile({ name: name.trim() || user.name, bike: bike.trim() || user.bike, location: location.trim() })
    pushToast({ title: 'Профіль оновлено', icon: 'success' })
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="px-5 pb-6 pt-2">
        <h2 className="mb-4 text-xl font-extrabold text-text">Редагувати профіль</h2>

        <FieldLabel>Ім’я</FieldLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} leftIcon={<User size={18} />} aria-label="Ім’я" />

        <div className="mt-3">
          <FieldLabel>Мотоцикл</FieldLabel>
          <Input value={bike} onChange={(e) => setBike(e.target.value)} leftIcon={<Bike size={18} />} aria-label="Мотоцикл" />
        </div>

        <div className="mt-3">
          <FieldLabel>Місто</FieldLabel>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} leftIcon={<MapPin size={18} />} aria-label="Місто" />
        </div>

        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Скасувати
          </Button>
          <Button className="flex-1" onClick={save}>
            Зберегти
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
