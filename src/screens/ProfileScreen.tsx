import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Settings,
  Bike,
  MapPin,
  Pencil,
  Share2,
  QrCode,
  Medal,
  Flame,
  Mountain,
  Users,
  Plus,
} from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { IconButton } from '@/components/ui/IconButton'
import { Avatar } from '@/components/ui/Avatar'
import { VerifiedBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Stat } from '@/components/ui/Stat'
import { SectionTitle } from '@/components/ui/ScreenHeader'
import { Sheet } from '@/components/ui/Sheet'
import { GalleryViewer } from '@/components/ui/GalleryViewer'
import { EditProfileSheet } from '@/components/profile/EditProfileSheet'
import { achievements } from '@/data/mock'
import { img } from '@/data/images'
import { formatNumber } from '@/lib/format'
import { share } from '@/lib/share'
import { useAppStore } from '@/store/useAppStore'
import { useCurrentUser } from '@/store/useCurrentUser'
import { useT } from '@/i18n'
import type { Achievement } from '@/data/types'

const achievementIcons = { medal: Medal, flame: Flame, mountain: Mountain, users: Users }

function AchievementBadge({ a, onClick }: { a: Achievement; onClick: () => void }) {
  const Icon = achievementIcons[a.icon]
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 transition-transform active:scale-95">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary ring-1 ring-primary/30">
        <Icon size={24} />
      </span>
      <span className="text-center text-xs font-medium text-text-secondary">{a.label}</span>
    </button>
  )
}

export function ProfileScreen() {
  const navigate = useNavigate()
  const u = useCurrentUser()
  const pushToast = useAppStore((s) => s.pushToast)
  const galleryItems = useAppStore((s) => s.galleryItems)
  const addGalleryPhoto = useAppStore((s) => s.addGalleryPhoto)
  const removeGalleryPhoto = useAppStore((s) => s.removeGalleryPhoto)
  const t = useT()
  const fileRef = useRef<HTMLInputElement>(null)

  const [editOpen, setEditOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [viewer, setViewer] = useState<number | null>(null)

  const onShare = async () => {
    const res = await share({ title: `${u.name} на MotoMeet`, text: u.handle })
    if (res === 'copied') pushToast({ title: 'Посилання скопійовано', icon: 'success' })
    else if (res === 'shared') pushToast({ title: 'Профіль поширено', icon: 'success' })
  }

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      addGalleryPhoto(String(reader.result))
      pushToast({ title: 'Фото додано', icon: 'success' })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-bg">
      <div className="mx-auto w-full max-w-app pb-28 lg:pb-10">
        {/* Cover */}
        <div className="relative h-52 w-full">
          <img src={img.mountainOverlook} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-bg" />
          <div className="absolute inset-x-0 top-0 z-10 pt-safe">
            <StatusBar />
            <div className="flex items-center justify-between px-4 pt-1">
              <IconButton label="Назад" variant="glass" onClick={() => navigate('/map')}>
                <ChevronLeft size={22} />
              </IconButton>
              <IconButton label="Налаштування" variant="glass" onClick={() => navigate('/settings')}>
                <Settings size={20} />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="-mt-12 flex flex-col items-center px-5 text-center">
          <Avatar src={u.avatar} alt={u.name} size={96} className="ring-4 ring-bg rounded-full" />
          <div className="mt-3 flex items-center gap-1.5">
            <h1 className="text-2xl font-extrabold text-text">{u.name}</h1>
            <VerifiedBadge size={20} />
          </div>
          <p className="text-text-secondary">{u.handle}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-sm font-medium text-text-secondary">
              <Bike size={14} className="text-primary" /> {u.bike}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-sm font-medium text-text-secondary">
              <MapPin size={14} className="text-accent" /> {u.location}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-5 mt-5 grid grid-cols-4 rounded-lg bg-surface-2 py-4">
          <Stat value={formatNumber(u.followers)} label={t('Підписники')} />
          <Stat value={formatNumber(u.following)} label={t('Підписки')} className="border-l border-border" />
          <Stat value={formatNumber(u.rides)} label={t('Заїзди')} className="border-l border-border" />
          <Stat value={formatNumber(u.events)} label={t('Події')} className="border-l border-border" />
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2.5 px-5">
          <Button className="flex-1" leftIcon={<Pencil size={16} />} onClick={() => setEditOpen(true)}>
            {t('Редагувати профіль')}
          </Button>
          <IconButton label="Поділитися профілем" variant="surface" size="lg" onClick={onShare}>
            <Share2 size={18} />
          </IconButton>
          <IconButton label="QR-код" variant="surface" size="lg" onClick={() => setQrOpen(true)}>
            <QrCode size={18} />
          </IconButton>
        </div>

        {/* Achievements */}
        <SectionTitle className="mt-7" action={<span className="text-sm text-text-muted">12 отримано</span>}>
          {t('Досягнення')}
        </SectionTitle>
        <div className="mt-3 grid grid-cols-4 gap-2 px-5">
          {achievements.map((a) => (
            <AchievementBadge
              key={a.id}
              a={a}
              onClick={() => pushToast({ title: `Досягнення: ${a.label}`, icon: 'flame' })}
            />
          ))}
        </div>

        {/* Gallery */}
        <SectionTitle
          className="mt-7"
          action={
            <button className="text-sm font-semibold text-primary" onClick={() => fileRef.current?.click()}>
              {t('Додати фото')}
            </button>
          }
        >
          {t('Галерея')}
        </SectionTitle>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} aria-label="Завантажити фото" />
        <div className="mt-3 grid grid-cols-3 gap-1.5 px-5">
          <button
            onClick={() => fileRef.current?.click()}
            className="grid aspect-square place-items-center rounded-md border-2 border-dashed border-border text-text-muted transition-colors hover:border-primary hover:text-primary"
            aria-label="Додати фото"
          >
            <Plus size={28} />
          </button>
          {galleryItems.map((item, i) => (
            <button key={item.id} onClick={() => setViewer(i)} className="aspect-square overflow-hidden rounded-md transition-transform active:scale-95">
              <img src={item.url} alt={`Фото заїзду ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <EditProfileSheet open={editOpen} onClose={() => setEditOpen(false)} />
      {viewer !== null && (
        <GalleryViewer
          images={galleryItems.map((g) => g.url)}
          index={viewer}
          onClose={() => setViewer(null)}
          onDelete={(idx) => removeGalleryPhoto(galleryItems[idx]?.id)}
        />
      )}
      <Sheet open={qrOpen} onClose={() => setQrOpen(false)}>
        <div className="flex flex-col items-center px-5 pb-8 pt-2">
          <h2 className="mb-4 text-xl font-extrabold text-text">Мій QR-код</h2>
          <div className="grid h-56 w-56 place-items-center rounded-2xl bg-white p-4">
            <QrPlaceholder text={u.handle} />
          </div>
          <p className="mt-4 text-sm text-text-secondary">{u.handle}</p>
        </div>
      </Sheet>
    </div>
  )
}

/** Deterministic decorative QR-like grid (no external dependency). */
function QrPlaceholder({ text }: { text: string }) {
  const n = 21
  let seed = 0
  for (let k = 0; k < text.length; k++) seed = (seed * 31 + text.charCodeAt(k)) >>> 0
  const cells: boolean[] = []
  for (let k = 0; k < n * n; k++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    cells.push((seed >> 8) % 2 === 0)
  }
  const isFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7)
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="h-full w-full" shapeRendering="crispEdges">
      {Array.from({ length: n * n }).map((_, k) => {
        const r = Math.floor(k / n)
        const c = k % n
        const on = isFinder(r, c)
          ? (r % 6 === 0 || c % 6 === 0 || (r > 1 && r < 5 && c > 1 && c < 5))
          : cells[k]
        return on ? <rect key={k} x={c} y={r} width={1} height={1} fill="#0F172A" /> : null
      })}
    </svg>
  )
}
