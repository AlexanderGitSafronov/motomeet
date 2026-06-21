import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  EyeOff,
  Ruler,
  Bell,
  CalendarCheck,
  Radar,
  Moon,
  Sun,
  Globe,
  ShieldCheck,
  LogOut,
  Check,
} from 'lucide-react'
import { StatusBar } from '@/components/ui/StatusBar'
import { Screen } from '@/components/layout/Screen'
import { IconButton } from '@/components/ui/IconButton'
import { Avatar } from '@/components/ui/Avatar'
import { Toggle } from '@/components/ui/Toggle'
import { Sheet } from '@/components/ui/Sheet'
import { SectionLabel } from '@/components/ui/ScreenHeader'
import { useAppStore } from '@/store/useAppStore'
import { useCurrentUser } from '@/store/useCurrentUser'
import { useT, LANGUAGES } from '@/i18n'
import { cn } from '@/lib/cn'

function SettingRow({
  icon,
  title,
  subtitle,
  trailing,
  onClick,
}: {
  icon: ReactNode
  title: string
  subtitle?: string
  trailing?: ReactNode
  onClick?: () => void
}) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3.5 rounded-lg card-surface px-4 py-3.5 text-left',
        onClick && 'transition-colors hover:bg-surface-2'
      )}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-surface-2 text-text">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-text">{title}</span>
        {subtitle && <span className="block text-sm text-text-secondary">{subtitle}</span>}
      </span>
      {trailing}
    </Comp>
  )
}

export function SettingsScreen() {
  const navigate = useNavigate()
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const settings = useAppStore((s) => s.settings)
  const toggleSetting = useAppStore((s) => s.toggleSetting)
  const logout = useAppStore((s) => s.logout)
  const lang = useAppStore((s) => s.lang)
  const setLang = useAppStore((s) => s.setLang)
  const currentUser = useCurrentUser()
  const t = useT()
  const [langOpen, setLangOpen] = useState(false)

  const currentLangLabel = LANGUAGES.find((l) => l.value === lang)?.label ?? 'Українська'

  return (
    <Screen contentClassName="px-0">
      <div className="px-5 pt-safe">
        <StatusBar />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-2">
        <IconButton label={t('Назад')} variant="surface" onClick={() => navigate(-1)} className="border-border bg-transparent">
          <ChevronLeft size={22} />
        </IconButton>
        <h1 className="text-2xl font-extrabold text-text">{t('Налаштування')}</h1>
      </div>

      {/* Profile card */}
      <button
        onClick={() => navigate('/profile')}
        className="mx-5 mt-4 flex items-center gap-3.5 rounded-lg card-surface p-4 text-left"
      >
        <Avatar src={currentUser.avatar} alt={currentUser.name} size={56} />
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-bold text-text">{currentUser.name}</span>
          <span className="block text-sm text-text-secondary">{t('Перегляд і редагування профілю')}</span>
        </span>
        <ChevronRight size={20} className="text-text-muted" />
      </button>

      {/* Privacy & location */}
      <SectionLabel className="mt-6">{t('Приватність і локація')}</SectionLabel>
      <div className="mt-3 flex flex-col gap-3 px-5">
        <SettingRow
          icon={<MapPin size={20} />}
          title={t('Приватність локації')}
          subtitle={t('Лише друзі')}
          trailing={<ChevronRight size={18} className="text-text-muted" />}
          onClick={() => {}}
        />
        <SettingRow
          icon={<EyeOff size={20} />}
          title={t('Режим-привид')}
          subtitle={t('Приховати геолокацію')}
          trailing={<Toggle checked={settings.ghostMode} onChange={() => toggleSetting('ghostMode')} label={t('Режим-привид')} />}
        />
        <SettingRow
          icon={<Ruler size={20} />}
          title={t('Показувати відстань')}
          subtitle={t('Показувати км іншим райдерам')}
          trailing={<Toggle checked={settings.showDistance} onChange={() => toggleSetting('showDistance')} label={t('Показувати відстань')} />}
        />
      </div>

      {/* Notifications */}
      <SectionLabel className="mt-6">{t('Сповіщення')}</SectionLabel>
      <div className="mt-3 flex flex-col gap-3 px-5">
        <SettingRow
          icon={<Bell size={20} />}
          title={t('Push-сповіщення')}
          subtitle={t('Звуки та банери')}
          trailing={<ChevronRight size={18} className="text-text-muted" />}
          onClick={() => navigate('/notifications')}
        />
        <SettingRow
          icon={<CalendarCheck size={20} />}
          title={t('Нагадування про події')}
          subtitle={t('За 30 хв до початку')}
          trailing={<Toggle checked={settings.eventReminders} onChange={() => toggleSetting('eventReminders')} label={t('Нагадування про події')} />}
        />
        <SettingRow
          icon={<Radar size={20} />}
          title={t('Райдери поруч')}
          subtitle={t('Сповіщати, коли друзі поруч')}
          trailing={<Toggle checked={settings.nearbyRiders} onChange={() => toggleSetting('nearbyRiders')} label={t('Райдери поруч')} />}
        />
      </div>

      {/* Appearance */}
      <SectionLabel className="mt-6">{t('Вигляд')}</SectionLabel>
      <div className="mt-3 flex flex-col gap-3 px-5">
        <SettingRow
          icon={theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          title={t('Тема')}
          subtitle={theme === 'dark' ? t('Темна тема') : t('Світла тема')}
          trailing={
            <div className="flex items-center rounded-full bg-surface-2 p-1">
              <button
                aria-label={t('Темна тема')}
                aria-pressed={theme === 'dark'}
                onClick={() => setTheme('dark')}
                className={cn('grid h-8 w-9 place-items-center rounded-full transition-colors', theme === 'dark' ? 'bg-primary text-on-primary' : 'text-text-muted')}
              >
                <Moon size={16} />
              </button>
              <button
                aria-label={t('Світла тема')}
                aria-pressed={theme === 'light'}
                onClick={() => setTheme('light')}
                className={cn('grid h-8 w-9 place-items-center rounded-full transition-colors', theme === 'light' ? 'bg-primary text-on-primary' : 'text-text-muted')}
              >
                <Sun size={16} />
              </button>
            </div>
          }
        />
        <SettingRow
          icon={<Globe size={20} />}
          title={t('Мова')}
          subtitle={currentLangLabel}
          trailing={<ChevronRight size={18} className="text-text-muted" />}
          onClick={() => setLangOpen(true)}
        />
        <SettingRow
          icon={<ShieldCheck size={20} />}
          title={t('Безпека')}
          subtitle={t('Пароль і 2FA')}
          trailing={<ChevronRight size={18} className="text-text-muted" />}
          onClick={() => {}}
        />
      </div>

      {/* Logout */}
      <div className="mt-6 px-5">
        <button
          onClick={() => {
            logout()
            navigate('/auth', { replace: true })
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-error-soft py-3.5 font-semibold text-error"
        >
          <LogOut size={18} /> {t('Вийти')}
        </button>
      </div>

      {/* Language picker */}
      <Sheet open={langOpen} onClose={() => setLangOpen(false)}>
        <div className="px-5 pb-7 pt-2">
          <h2 className="mb-3 text-xl font-extrabold text-text">{t('Мова')}</h2>
          <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto no-scrollbar">
            {LANGUAGES.map((l) => (
              <button
                key={l.value}
                onClick={() => {
                  setLang(l.value)
                  setLangOpen(false)
                }}
                aria-label={l.label}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-left',
                  l.value === lang ? 'bg-primary-soft' : 'bg-surface-2'
                )}
              >
                <span className="text-2xl">{l.flag}</span>
                <span className="flex-1 font-semibold text-text">{l.label}</span>
                {l.value === lang && <Check size={20} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>
      </Sheet>
    </Screen>
  )
}
