import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Apple, User } from 'lucide-react'
import { LogoTile } from '@/components/brand/Logo'
import { Input } from '@/components/ui/Input'
import { Segmented } from '@/components/ui/Segmented'
import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import { img } from '@/data/images'
import { useAppStore } from '@/store/useAppStore'
import { useT } from '@/i18n'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  )
}

export function AuthScreen() {
  const navigate = useNavigate()
  const signInApi = useAppStore((s) => s.signIn)
  const registerApi = useAppStore((s) => s.register)
  const pushToast = useAppStore((s) => s.pushToast)
  const t = useT()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('markus@motomeet.cc')
  const [password, setPassword] = useState('ridetogether')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)

  const demoSignIn = () => {
    void signInApi('markus@motomeet.cc', 'ridetogether').finally(() => navigate('/map', { replace: true }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Введіть ім’я')
        if (password.length < 6) throw new Error('Пароль має містити щонайменше 6 символів')
        if (password !== confirm) throw new Error('Паролі не збігаються')
        await registerApi(name.trim(), email.trim(), password)
        pushToast({ title: `Вітаємо, ${name.trim().split(' ')[0]}! 🏍️`, icon: 'success' })
      } else {
        await signInApi(email.trim(), password)
      }
      navigate('/map', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося увійти')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-bg">
      <img src={img.neonCity} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #0F172A33 0%, #0F172ACC 50%, #0F172A 84%)' }}
      />
      <div
        className="pointer-events-none absolute -left-16 -top-24 h-80 w-80"
        style={{ background: 'radial-gradient(circle, #8B5CF659 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto flex h-full max-w-app flex-col overflow-hidden px-4 pt-safe pb-safe">
        {/* Brand block */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3 pt-5 text-center">
          <LogoTile size={60} />
          <h1 className="font-display text-[36px] leading-none tracking-wide text-white">MOTOMEET</h1>
          <p className="text-[15px] font-medium text-text-secondary">{t('Знайди свою команду. Катай разом.')}</p>
        </div>

        {/* Glassmorphic form panel */}
        <form
          onSubmit={onSubmit}
          className="mb-3 flex flex-col gap-3 rounded-[28px] border border-white/15 p-5 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          style={{ background: '#0F172ACC' }}
        >
          <Segmented
            options={[
              { value: 'login', label: t('Увійти') },
              { value: 'signup', label: t('Реєстрація') },
            ]}
            value={mode}
            onChange={(m) => {
              setMode(m)
              setError('')
            }}
            className="h-12 bg-surface-2"
          />

          {mode === 'signup' && (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше ім’я"
              leftIcon={<User size={18} />}
              aria-label="Ім’я"
              autoComplete="name"
            />
          )}

          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@motomeet.cc"
            leftIcon={<Mail size={18} />}
            aria-label="Електронна пошта"
            autoComplete="email"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            leftIcon={<Lock size={18} />}
            aria-label="Пароль"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />

          {mode === 'signup' && (
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Повторіть пароль"
              leftIcon={<Lock size={18} />}
              aria-label="Повторіть пароль"
              autoComplete="new-password"
            />
          )}

          {mode === 'login' && (
            <div className="text-right">
              <button type="button" onClick={() => setForgotOpen(true)} className="text-[13px] font-semibold text-primary">
                {t('Забули пароль?')}
              </button>
            </div>
          )}

          {error && <p className="text-center text-[13px] font-medium text-error">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-on-primary shadow-glow transition-transform active:scale-[0.98] disabled:opacity-70"
          >
            {busy ? t('Зачекайте…') : mode === 'login' ? t('Увійти') : t('Створити акаунт')}
            <ArrowRight size={18} />
          </button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-text-muted">{t('або увійти через')}</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={demoSignIn}
              className="flex h-[52px] flex-1 items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface-2 text-[15px] font-semibold text-text active:scale-[0.98]"
            >
              <GoogleIcon /> Google
            </button>
            <button
              type="button"
              onClick={demoSignIn}
              className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-surface-2 text-[15px] font-semibold text-text active:scale-[0.98]"
            >
              <Apple size={18} fill="currentColor" /> Apple
            </button>
          </div>

          <p className="text-center text-[11px] font-medium text-text-muted">
            {t('Продовжуючи, ви приймаєте Умови та Політику конфіденційності')}
          </p>
        </form>
      </div>

      {/* Forgot password sheet */}
      <Sheet open={forgotOpen} onClose={() => setForgotOpen(false)}>
        <ForgotPassword onDone={() => setForgotOpen(false)} defaultEmail={email} />
      </Sheet>
    </div>
  )
}

function ForgotPassword({ onDone, defaultEmail }: { onDone: () => void; defaultEmail: string }) {
  const pushToast = useAppStore((s) => s.pushToast)
  const [email, setEmail] = useState(defaultEmail)
  return (
    <div className="px-5 pb-7 pt-2">
      <h2 className="text-xl font-extrabold text-text">Відновлення пароля</h2>
      <p className="mt-1 text-sm text-text-secondary">Надішлемо посилання для скидання пароля на вашу пошту.</p>
      <div className="mt-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@motomeet.cc"
          leftIcon={<Mail size={18} />}
          aria-label="Електронна пошта"
        />
      </div>
      <Button
        block
        size="lg"
        className="mt-4"
        onClick={() => {
          pushToast({ title: 'Лист для відновлення надіслано 📧', icon: 'success' })
          onDone()
        }}
      >
        Надіслати посилання
      </Button>
    </div>
  )
}
