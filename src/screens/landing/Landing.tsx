import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Map,
  Flag,
  Users,
  Route as RouteIcon,
  MessageCircle,
  ShieldCheck,
  Download,
  Bike,
  CircleCheck,
  Trophy,
  Instagram,
  Youtube,
  Twitter,
  Music2,
} from 'lucide-react'
import { LogoTile } from '@/components/brand/Logo'
import { useReveal, useCountUp } from '@/hooks/useReveal'
import { useT, localeOf } from '@/i18n'
import { useAppStore } from '@/store/useAppStore'
import { Reveal, StoreButtons, PhoneFrame, FloatChip, SectionHead, Parallax, GlowOrb } from './parts'
import { cn } from '@/lib/cn'

const IMG = '/img'

// ---------------------------------------------------------------- Nav
function Nav() {
  const t = useT()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const links = [
    { label: 'Можливості', href: '#features' },
    { label: 'Маршрути', href: '#routes' },
    { label: 'Спільнота', href: '#clubs' },
    { label: 'Ціни', href: '#pricing' },
  ]
  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'border-b border-border bg-bg/80 backdrop-blur-xl' : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-3.5 md:px-12">
        <a href="#top" className="flex items-center gap-3">
          <LogoTile size={44} />
          <span className="font-display text-2xl tracking-wide text-white">MOTOMEET</span>
        </a>
        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[15px] font-medium text-text-secondary transition-colors hover:text-text">
              {t(l.label)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="hidden text-[15px] font-semibold text-text sm:block">
            {t('Увійти')}
          </Link>
          <Link
            to="/auth"
            className="rounded-full bg-primary px-5 py-2.5 text-[15px] font-semibold text-on-primary shadow-glow-sm transition-all hover:bg-primary-hover active:scale-95"
          >
            {t('Завантажити застосунок')}
          </Link>
        </div>
      </div>
    </header>
  )
}

// ---------------------------------------------------------------- Hero
function Hero() {
  const t = useT()
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <Parallax speed={0.16} scale className="absolute -inset-y-[12%] inset-x-0">
        <img src={`${IMG}/generated-1782058784638.png`} alt="" className="h-full w-full object-cover" />
      </Parallax>
      <div className="absolute inset-0 bg-[#0F172A]/30" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #0F172A 0%, #0F172Af2 30%, #0F172A55 62%, transparent 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 45%, #0F172A 100%)' }} />
      <div className="animate-glow-pulse pointer-events-none absolute -right-20 top-10 h-[620px] w-[620px] rounded-full" style={{ background: 'radial-gradient(circle, #8B5CF640, transparent 70%)' }} />

      <div className="relative mx-auto flex max-w-[1240px] flex-col items-center gap-12 px-5 pb-24 pt-36 md:px-12 lg:flex-row lg:justify-between lg:pt-40">
        {/* Left */}
        <div className="max-w-xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0F172A]/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </span>
              {t('128 райдерів зараз у дорозі поруч')}
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-6 font-display text-[clamp(44px,7vw,76px)] leading-[0.96] tracking-tight text-white">
              {t('ЗНАЙДИ СВОЮ КОМАНДУ.')}
              <br />
              <span className="text-shimmer">{t('КАТАЙ ПО СВІТУ.')}</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-slate-300">
              {t('MotoMeet збирає кожного райдера, клуб і ралі на одній живій карті. Дивись, хто катає поруч, приєднуйся до справжніх подій, плануй епічні маршрути — і більше ніколи не катай наодинці.')}
            </p>
          </Reveal>
          <Reveal delay={3}>
            <StoreButtons className="mt-8" />
          </Reveal>
          <Reveal delay={4}>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-lg tracking-tight text-warning">★★★★★</span>
              <span className="text-[15px] font-medium text-slate-300">{t('4.9 · обожнюють 12 000+ райдерів')}</span>
            </div>
          </Reveal>
        </div>

        {/* Right: phone */}
        <Parallax speed={0.05} tilt={-3} className="relative">
          <div className="animate-float-slow">
            <PhoneFrame src="/landing/screen-map.png" glow="#8B5CF680" className="w-[300px] md:w-[330px]" />
          </div>
          <FloatChip
            className="absolute -left-10 top-24 hidden md:flex"
            icon={<Flag size={16} className="text-white" />}
            tint="#3B82F6"
            title={t('42 учасники')}
            subtitle={t('Ралі «Альпійський грім»')}
          />
          <FloatChip
            className="absolute -right-8 bottom-28 hidden md:flex"
            icon={<Users size={16} className="text-white" />}
            tint="#22C55E"
            title="Залізні Вовки MC"
            subtitle={t('1 240 учасників')}
          />
        </Parallax>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Stats
const STATS = [
  { num: 50, suffix: 'K+', label: 'Активних райдерів' },
  { num: 1200, suffix: '+', label: 'Клубів і команд', comma: true },
  { num: 8500, suffix: '+', label: 'Ралі та заїздів', comma: true },
  { num: 2, suffix: 'M+', label: 'Км пройдено разом' },
]
function Stats() {
  const t = useT()
  const { ref, shown } = useReveal<HTMLDivElement>()
  return (
    <section className="border-y border-border bg-bg">
      <div ref={ref} className="mx-auto max-w-[1240px] px-5 py-14 md:px-12">
        <p className="text-center text-[13px] font-bold uppercase tracking-[0.2em] text-text-muted">
          {t('Нам довіряють райдери у 40+ країнах')}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-y-8 md:flex md:items-center md:justify-between">
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <StatItem stat={s} active={shown} />
              {i < STATS.length - 1 && <span className="mx-auto hidden h-14 w-px bg-border md:block" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
function StatItem({ stat, active }: { stat: (typeof STATS)[number]; active: boolean }) {
  const t = useT()
  const lang = useAppStore((s) => s.lang)
  const v = useCountUp(stat.num, active)
  const shown = stat.comma ? v.toLocaleString(localeOf(lang)) : String(v)
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <span className="font-display text-[clamp(36px,5vw,48px)] tracking-tight text-text">
        {shown}
        {stat.suffix}
      </span>
      <span className="mt-1 text-[15px] font-medium text-text-secondary">{t(stat.label)}</span>
    </div>
  )
}

// ---------------------------------------------------------------- Features
const FEATURES = [
  { icon: Map, color: '#8B5CF6', title: 'Жива карта райдерів', desc: 'Кожен райдер, клуб і подія поруч — наживо на одній красивій карті.' },
  { icon: Flag, color: '#3B82F6', title: 'Події та ралі', desc: 'Знаходь ралі та трек-дні. Приєднуйся в один тап — отримуй маршрут і команду.' },
  { icon: Users, color: '#22C55E', title: 'Клуби та команди', desc: 'Вступай до мотоклубу або створи власний. Діліться заїздами й спілкуйтесь.' },
  { icon: RouteIcon, color: '#F59E0B', title: 'Плануй епічні маршрути', desc: 'Будуй звивисті маршрути, зберігай улюблені та їдь з покроковою навігацією.' },
  { icon: MessageCircle, color: '#8B5CF6', title: 'Чат у реальному часі', desc: 'Пиши райдерам і клубам, заходь у групові чати, плануй наступний заїзд.' },
  { icon: ShieldCheck, color: '#EF4444', title: 'Катай безпечно', desc: 'Жива геолокація, SOS-сигнали та чек-іни тримають команду разом.' },
]
function Features() {
  const t = useT()
  return (
    <section id="features" className="bg-bg">
      <div className="mx-auto max-w-[1240px] px-5 py-24 md:px-12">
        <SectionHead
          eyebrow={t('Усе для твого заїзду')}
          title={t('ОДИН ЗАСТОСУНОК ДЛЯ ВСЬОГО ЗАЇЗДУ')}
          subtitle={t('Від першого маркера на карті до останньої милі ралі — MotoMeet збирає всю мотоспільноту в одному місці.')}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div className="group h-full rounded-[22px] border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-glow">
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${f.color}26`, color: f.color }}
                >
                  <f.icon size={26} />
                </span>
                <h3 className="mt-5 text-xl font-bold text-text">{t(f.title)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{t(f.desc)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Showcase
const SHOWCASE = [
  {
    id: 'events',
    eyebrow: 'Ралі та події',
    eyebrowColor: '#3B82F6',
    title: 'ПРИЄДНУЙСЯ ДО РАЛІ, ВАРТИХ ЗАЇЗДУ',
    desc: 'Від вихідних на треку до багатоденних гірських ралі — дивись маршрут, команду й атмосферу ще до старту. Приєднуйся в один тап — і ти в грі.',
    bullets: ['Повний маршрут, розклад і точка збору', 'Бачиш, хто їде та хто організовує', 'Додай у календар і отримуй нагадування'],
    screen: '/landing/screen-event.png',
    glow: '#3B82F6',
    chip: { icon: <Flag size={16} className="text-white" />, tint: '#3B82F6', title: '184 учасники', subtitle: 'Ралі «Альпійський грім»' },
  },
  {
    id: 'profile',
    eyebrow: 'Твій профіль райдера',
    eyebrowColor: '#8B5CF6',
    title: 'ПРОФІЛЬ, ЩО РОЗПОВІДАЄ ТВОЮ ІСТОРІЮ',
    desc: 'Твій гараж, твої кілометри, твоя команда. Покажи мотоцикли, на яких катаєш, маршрути, які підкорив, і нагороди, здобуті в дорозі.',
    bullets: ['Покажи мотоцикли у своєму гаражі', 'Відстежуй заїзди, відстань і досягнення', 'Збирай підписників і вступай у команди'],
    screen: '/landing/screen-profile.png',
    glow: '#8B5CF6',
    chip: { icon: <Trophy size={16} className="text-white" />, tint: '#F59E0B', title: 'Підкорювач Альп', subtitle: 'Досягнення відкрито' },
    reverse: true,
  },
  {
    id: 'clubs',
    eyebrow: 'Клуби та спільнота',
    eyebrowColor: '#22C55E',
    title: 'ЗНАЙДИ КОМАНДУ, СТВОРИ СВІЙ КЛУБ',
    desc: 'Вступай до мотоклубу або створи власний. Публікуй заїзди, збирай учасників і підтримуй спілкування між кожним заїздом.',
    bullets: ['Створюй або вступай у клуби за секунди', 'Групові чати й анонси заїздів', 'Ролі учасників, події та спільні маршрути'],
    screen: '/landing/screen-chat.png',
    glow: '#22C55E',
    chip: { icon: <MessageCircle size={16} className="text-white" />, tint: '#22C55E', title: '3 нові повідомлення', subtitle: 'Клуб «Мюнхенські райдери»' },
  },
]
function Showcase() {
  const t = useT()
  return (
    <section className="relative isolate overflow-hidden bg-bg">
      <Parallax speed={0.1} className="absolute -inset-y-[10%] inset-x-0">
        <img src={`${IMG}/generated-1782059590754.png`} alt="" className="h-full w-full object-cover opacity-[0.06]" />
      </Parallax>
      <div className="absolute inset-0 bg-bg/80" />
      <GlowOrb color="#3B82F633" size={560} className="left-[58%] top-[3%]" />
      <GlowOrb color="#8B5CF63a" size={620} className="left-[-12%] top-[40%]" speed={0.12} />
      <GlowOrb color="#22C55E2e" size={560} className="left-[60%] top-[72%]" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-20 md:px-12">
        <SectionHead eyebrow={t('Подивись у дії')} title={t('СТВОРЕНО ДЛЯ ТВОГО СТИЛЮ ЇЗДИ')} />
        <div className="mt-10 flex flex-col gap-24">
          {SHOWCASE.map((s) => (
            <div
              key={s.id}
              className={cn(
                'flex flex-col items-center gap-12 lg:flex-row lg:gap-20',
                s.reverse && 'lg:flex-row-reverse'
              )}
            >
              {/* Text */}
              <Reveal className="flex-1">
                <p className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: s.eyebrowColor }}>
                  {t(s.eyebrow)}
                </p>
                <h3 className="mt-3 font-display text-[clamp(28px,4vw,44px)] leading-tight tracking-tight text-text">{t(s.title)}</h3>
                <p className="mt-4 max-w-md text-[17px] leading-relaxed text-text-secondary">{t(s.desc)}</p>
                <ul className="mt-6 flex flex-col gap-3.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-[16px] text-text">
                      <CircleCheck size={22} className="shrink-0 text-success" />
                      {t(b)}
                    </li>
                  ))}
                </ul>
              </Reveal>
              {/* Phone */}
              <Reveal delay={1} className="relative flex flex-1 justify-center">
                <Parallax speed={0.07} tilt={s.reverse ? 3 : -3} className="relative">
                  <PhoneFrame src={s.screen} glow={`${s.glow}66`} />
                </Parallax>
                <FloatChip
                  className={cn('absolute bottom-16 z-10', s.reverse ? '-right-4 md:-right-10' : '-left-4 md:-left-10')}
                  icon={s.chip.icon}
                  tint={s.chip.tint}
                  title={t(s.chip.title)}
                  subtitle={t(s.chip.subtitle)}
                />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- How it works
const STEPS = [
  { n: '01', color: '#8B5CF6', icon: Download, title: 'Завантаж і зареєструйся', desc: 'Встанови MotoMeet безкоштовно на iOS чи Android і створи профіль райдера менш ніж за хвилину.' },
  { n: '02', color: '#3B82F6', icon: Map, title: 'Відкрий живу карту', desc: 'Бачиш райдерів, клуби та події навколо в реальному часі. Фільтруй саме те, що шукаєш.' },
  { n: '03', color: '#22C55E', icon: Bike, title: 'Катайте разом', desc: 'Приєднуйся до ралі, пиши команді та вирушай у дорогу. Більше ніколи не катай наодинці.' },
]
function HowItWorks() {
  const t = useT()
  return (
    <section id="routes" className="bg-[#0B1220]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 md:px-12">
        <SectionHead eyebrow={t('Почни кататися за хвилини')} title={t('ТРИ КРОКИ ДО НАСТУПНОГО ЗАЇЗДУ')} />
        <div className="relative mt-14 grid gap-5 md:grid-cols-3">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-[72px] hidden h-px bg-gradient-to-r from-[#8B5CF600] via-primary/50 to-[#22C55E00] md:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div className="group/step relative z-10 h-full rounded-[22px] border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-glow">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[44px] leading-none transition-transform duration-300 group-hover/step:scale-110" style={{ color: s.color }}>{s.n}</span>
                  <span
                    className="grid h-12 w-12 place-items-center rounded-full transition-transform duration-300 group-hover/step:rotate-6 group-hover/step:scale-110"
                    style={{ background: `${s.color}26`, color: s.color }}
                  >
                    <s.icon size={24} />
                  </span>
                </div>
                <h3 className="mt-5 text-[21px] font-bold text-text">{t(s.title)}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">{t(s.desc)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Testimonials
const TESTIMONIALS = [
  { quote: 'Я знайшов цілу команду за тиждень після встановлення MotoMeet. Відтоді ми разом зробили чотири гірські поїздки.', name: 'Маркус Раєр', role: 'Ducati Monster · Мюнхен', avatar: `${IMG}/generated-1782059125075.png`, ring: '#8B5CF6' },
  { quote: 'Жива карта затягує. Бачу, хто зараз у дорозі, і просто під’їжджаю на зустріч. Повністю змінює гру.', name: 'Лена Фогт', role: 'Street Triple · Берлін', avatar: `${IMG}/generated-1782059149683.png`, ring: '#3B82F6' },
  { quote: 'Організовувати ралі клубу було хаосом. Тепер усі підтверджують участь і отримують маршрут в один тап.', name: 'Залізні Вовки MC', role: 'Адмін клубу · Альпи', avatar: `${IMG}/generated-1782059160111.png`, ring: '#22C55E' },
]
function Testimonials() {
  const t = useT()
  return (
    <section id="clubs" className="bg-bg">
      <div className="mx-auto max-w-[1240px] px-5 py-24 md:px-12">
        <SectionHead eyebrow={t('Обожнюють райдери')} title={t('РАЙДЕРИ ГОВОРЯТЬ')} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((tt, i) => (
            <Reveal key={tt.name} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <figure className="flex h-full flex-col gap-5 rounded-[22px] border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-glow">
                <span className="text-warning">★★★★★</span>
                <blockquote className="flex-1 text-[16px] leading-relaxed text-text">{t(tt.quote)}</blockquote>
                <figcaption className="flex items-center gap-3">
                  <img src={tt.avatar} alt={tt.name} className="h-11 w-11 rounded-full object-cover" style={{ boxShadow: `0 0 0 2px ${tt.ring}` }} />
                  <span>
                    <span className="block text-[15px] font-bold text-text">{tt.name}</span>
                    <span className="block text-[13px] text-text-muted">{t(tt.role)}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Final CTA
function FinalCta() {
  const t = useT()
  return (
    <section id="pricing" className="relative isolate overflow-hidden" style={{ background: 'linear-gradient(120deg, #8B5CF6 0%, #6D28D9 50%, #3B1675 100%)' }}>
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[700px] w-[900px] -translate-x-1/2" style={{ background: 'radial-gradient(ellipse at top, #FFFFFF24, transparent 60%)' }} />
      <div className="relative mx-auto flex max-w-[1240px] flex-col items-center px-5 py-28 text-center md:px-12">
        <Reveal>
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-white/70">{t('Завантаження безкоштовне')}</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-4 font-display text-[clamp(40px,7vw,62px)] leading-[1.02] tracking-tight text-white">
            {t('ТВІЙ НАСТУПНИЙ ЗАЇЗД ПОЧИНАЄТЬСЯ ТУТ')}
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-5 max-w-xl text-[19px] leading-relaxed text-white/90">
            {t('Приєднуйся до 50 000+ райдерів, які вже на карті. Завантаж MotoMeet, знайди свою команду й перетвори кожен заїзд на зустріч.')}
          </p>
        </Reveal>
        <Reveal delay={3}>
          <StoreButtons className="mt-9 justify-center" />
        </Reveal>
        <Reveal delay={4}>
          <p className="mt-6 text-sm font-medium text-white/85">{t('★★★★★ 4.9 в App Store · Безкоштовно · Без реклами, назавжди')}</p>
        </Reveal>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Footer
const FOOT: Record<string, string[]> = {
  Продукт: ['Жива карта', 'Події та ралі', 'Клуби та команди', 'Планувальник маршрутів', 'Ціни'],
  Спільнота: ['Для райдерів', 'Для клубів', 'Безпека в дорозі', 'Історії райдерів'],
  Компанія: ['Про нас', 'Кар’єра', 'Прес-кіт', 'Контакти'],
}
function Footer() {
  const t = useT()
  return (
    <footer className="border-t border-border bg-[#0B1220]">
      <div className="mx-auto max-w-[1240px] px-5 py-16 md:px-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <LogoTile size={40} />
              <span className="font-display text-[23px] tracking-wide text-white">MOTOMEET</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              {t('Жива карта для світової мотоспільноти. Знаходь райдерів, приєднуйся до ралі, ніколи не катай наодинці.')}
            </p>
            <div className="mt-5 flex gap-2.5">
              {[Instagram, Youtube, Twitter, Music2].map((Icon, i) => (
                <a key={i} href="/auth" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface-2 text-text-secondary transition-colors hover:text-text">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            {Object.entries(FOOT).map(([head, items]) => (
              <div key={head}>
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-text-muted">{t(head)}</h4>
                <ul className="mt-4 flex flex-col gap-3">
                  {items.map((it) => (
                    <li key={it}>
                      <a href="#top" className="text-[15px] font-medium text-text-secondary transition-colors hover:text-text">
                        {t(it)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="my-10 h-px bg-border" />
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[13px] text-text-muted">{t('© 2026 MotoMeet. Зроблено райдерами для райдерів.')}</p>
          <div className="flex gap-7">
            {['Приватність', 'Умови', 'Cookies'].map((l) => (
              <a key={l} href="#top" className="text-[13px] text-text-muted transition-colors hover:text-text">
                {t(l)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ---------------------------------------------------------------- Page
export function Landing() {
  // The landing is always dark, matching the mockup.
  useEffect(() => {
    const prev = document.documentElement.getAttribute('data-theme')
    document.documentElement.setAttribute('data-theme', 'dark')
    return () => {
      if (prev) document.documentElement.setAttribute('data-theme', prev)
    }
  }, [])

  return (
    <div className="min-h-[100dvh] bg-bg text-text">
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Showcase />
        <HowItWorks />
        <Testimonials />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
