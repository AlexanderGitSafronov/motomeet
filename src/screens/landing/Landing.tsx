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
import { Reveal, StoreButtons, PhoneFrame, FloatChip, SectionHead } from './parts'
import { cn } from '@/lib/cn'

const IMG = '/img'

// ---------------------------------------------------------------- Nav
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const links = ['Features', 'Events', 'Clubs', 'Routes', 'Pricing']
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
            <a key={l} href={`#${l.toLowerCase()}`} className="text-[15px] font-medium text-text-secondary transition-colors hover:text-text">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="hidden text-[15px] font-semibold text-text sm:block">
            Log in
          </Link>
          <Link
            to="/auth"
            className="rounded-full bg-primary px-5 py-2.5 text-[15px] font-semibold text-on-primary shadow-glow-sm transition-all hover:bg-primary-hover active:scale-95"
          >
            Get the app
          </Link>
        </div>
      </div>
    </header>
  )
}

// ---------------------------------------------------------------- Hero
function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <img src={`${IMG}/generated-1782058784638.png`} alt="" className="absolute inset-0 h-full w-full object-cover" />
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
              128 riders riding now near you
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-6 font-display text-[clamp(44px,7vw,76px)] leading-[0.96] tracking-tight text-white">
              FIND YOUR CREW.
              <br />
              RIDE THE <span className="text-shimmer">WORLD.</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-slate-300">
              MotoMeet puts every rider, club and rally on one live map. See who's riding near you, join real events,
              plan epic routes — and never ride alone again.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <StoreButtons className="mt-8" />
          </Reveal>
          <Reveal delay={4}>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-lg tracking-tight text-warning">★★★★★</span>
              <span className="text-[15px] font-medium text-slate-300">4.9 · loved by 12,000+ riders</span>
            </div>
          </Reveal>
        </div>

        {/* Right: phone */}
        <div className="animate-float relative">
          <PhoneFrame src="/landing/screen-map.png" glow="#8B5CF680" className="w-[300px] md:w-[330px]" />
          <FloatChip
            className="absolute -left-10 top-24 hidden md:flex"
            icon={<Flag size={16} className="text-white" />}
            tint="#3B82F6"
            title="42 going"
            subtitle="Alpine Thunder Rally"
          />
          <FloatChip
            className="absolute -right-8 bottom-28 hidden md:flex"
            icon={<Users size={16} className="text-white" />}
            tint="#22C55E"
            title="Iron Wolves MC"
            subtitle="1,240 members"
          />
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Stats
const STATS = [
  { num: 50, suffix: 'K+', label: 'Active riders' },
  { num: 1200, suffix: '+', label: 'Clubs & crews', comma: true },
  { num: 8500, suffix: '+', label: 'Rallies & rides', comma: true },
  { num: 2, suffix: 'M+', label: 'Km ridden together' },
]
function Stats() {
  const { ref, shown } = useReveal<HTMLDivElement>()
  return (
    <section className="border-y border-border bg-bg">
      <div ref={ref} className="mx-auto max-w-[1240px] px-5 py-14 md:px-12">
        <p className="text-center text-[13px] font-bold uppercase tracking-[0.2em] text-text-muted">
          Trusted by riders in 40+ countries
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
  const v = useCountUp(stat.num, active)
  const shown = stat.comma ? v.toLocaleString('en-US') : String(v)
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <span className="font-display text-[clamp(36px,5vw,48px)] tracking-tight text-text">
        {shown}
        {stat.suffix}
      </span>
      <span className="mt-1 text-[15px] font-medium text-text-secondary">{stat.label}</span>
    </div>
  )
}

// ---------------------------------------------------------------- Features
const FEATURES = [
  { icon: Map, color: '#8B5CF6', title: 'Live rider map', desc: 'Every rider, club and event near you — live on one beautiful map.' },
  { icon: Flag, color: '#3B82F6', title: 'Events & rallies', desc: 'Discover rallies and track days. RSVP in a tap, get the route and crew.' },
  { icon: Users, color: '#22C55E', title: 'Clubs & crews', desc: 'Join an MC or start your own. Share rides and chat with your members.' },
  { icon: RouteIcon, color: '#F59E0B', title: 'Plan epic routes', desc: 'Build twisty routes, save favorites and navigate turn-by-turn.' },
  { icon: MessageCircle, color: '#8B5CF6', title: 'Real-time chat', desc: 'Message riders and clubs, drop into group chats, plan the next ride.' },
  { icon: ShieldCheck, color: '#EF4444', title: 'Ride safe', desc: 'Live location, SOS alerts and check-ins keep your crew together.' },
]
function Features() {
  return (
    <section id="features" className="bg-bg">
      <div className="mx-auto max-w-[1240px] px-5 py-24 md:px-12">
        <SectionHead
          eyebrow="Everything you need to ride"
          title="ONE APP FOR THE WHOLE RIDE"
          subtitle="From the first marker on the map to the last mile of the rally — MotoMeet brings the whole motorcycle community into one place."
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
                <h3 className="mt-5 text-xl font-bold text-text">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{f.desc}</p>
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
    eyebrow: 'Rallies & events',
    eyebrowColor: '#3B82F6',
    title: 'JOIN RALLIES WORTH THE RIDE',
    desc: "From weekend track days to multi-day mountain rallies — see the route, the crew and the vibe before you commit. RSVP in one tap and you're in.",
    bullets: ['Full route, schedule and meeting point', "See who's going and who's hosting", 'Add to calendar and get ride reminders'],
    screen: '/landing/screen-event.png',
    glow: '#3B82F6',
    chip: { icon: <Flag size={16} className="text-white" />, tint: '#3B82F6', title: '184 going', subtitle: 'Alpine Thunder Rally' },
  },
  {
    id: 'profile',
    eyebrow: 'Your rider profile',
    eyebrowColor: '#8B5CF6',
    title: 'A PROFILE THAT TELLS YOUR STORY',
    desc: "Your garage, your miles, your crew. Show off the bikes you ride, the routes you've conquered and the badges you've earned along the way.",
    bullets: ['Showcase the bikes in your garage', 'Track rides, distance and achievements', 'Build your following and join crews'],
    screen: '/landing/screen-profile.png',
    glow: '#8B5CF6',
    chip: { icon: <Trophy size={16} className="text-white" />, tint: '#F59E0B', title: 'Alps Master', subtitle: 'Achievement unlocked' },
    reverse: true,
  },
  {
    id: 'clubs',
    eyebrow: 'Clubs & community',
    eyebrowColor: '#22C55E',
    title: 'FIND YOUR CREW, BUILD YOUR CLUB',
    desc: 'Join a motorcycle club or start your own. Post rides, rally your members and keep the conversation going between every ride.',
    bullets: ['Create or join clubs in seconds', 'Group chats and ride announcements', 'Member roles, events and shared routes'],
    screen: '/landing/screen-chat.png',
    glow: '#22C55E',
    chip: { icon: <MessageCircle size={16} className="text-white" />, tint: '#22C55E', title: '3 new messages', subtitle: 'Munich Riders club' },
  },
]
function Showcase() {
  return (
    <section className="relative isolate overflow-hidden bg-bg">
      <img src={`${IMG}/generated-1782059590754.png`} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.06]" />
      <div className="absolute inset-0 bg-bg/80" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-20 md:px-12">
        <SectionHead eyebrow="See it in action" title="BUILT FOR THE WAY YOU RIDE" />
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
                  {s.eyebrow}
                </p>
                <h3 className="mt-3 font-display text-[clamp(28px,4vw,44px)] leading-tight tracking-tight text-text">{s.title}</h3>
                <p className="mt-4 max-w-md text-[17px] leading-relaxed text-text-secondary">{s.desc}</p>
                <ul className="mt-6 flex flex-col gap-3.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-[16px] text-text">
                      <CircleCheck size={22} className="shrink-0 text-success" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>
              {/* Phone */}
              <Reveal delay={1} className="relative flex flex-1 justify-center">
                <PhoneFrame src={s.screen} glow={`${s.glow}66`} />
                <FloatChip
                  className={cn('absolute bottom-16', s.reverse ? '-right-4 md:-right-10' : '-left-4 md:-left-10')}
                  icon={s.chip.icon}
                  tint={s.chip.tint}
                  title={s.chip.title}
                  subtitle={s.chip.subtitle}
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
  { n: '01', color: '#8B5CF6', icon: Download, title: 'Download & sign up', desc: 'Grab MotoMeet free on iOS or Android and build your rider profile in under a minute.' },
  { n: '02', color: '#3B82F6', icon: Map, title: 'Open the live map', desc: "See riders, clubs and events around you in real time. Filter by exactly what you're looking for." },
  { n: '03', color: '#22C55E', icon: Bike, title: 'Ride together', desc: 'RSVP to rallies, message your crew and hit the open road. Never ride alone again.' },
]
function HowItWorks() {
  return (
    <section id="routes" className="bg-[#0B1220]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 md:px-12">
        <SectionHead eyebrow="Get riding in minutes" title="THREE STEPS TO YOUR NEXT RIDE" />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div className="h-full rounded-[22px] border border-border bg-surface p-8">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[44px] leading-none" style={{ color: s.color }}>{s.n}</span>
                  <span className="grid h-12 w-12 place-items-center rounded-full" style={{ background: `${s.color}26`, color: s.color }}>
                    <s.icon size={24} />
                  </span>
                </div>
                <h3 className="mt-5 text-[21px] font-bold text-text">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">{s.desc}</p>
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
  { quote: "I found a whole crew within a week of installing MotoMeet. We've done four mountain trips together since.", name: 'Marcus Reier', role: 'Ducati Monster · Munich', avatar: `${IMG}/generated-1782059125075.png`, ring: '#8B5CF6' },
  { quote: "The live map is addictive. I can see who's out riding and just roll up to a meet. Total game changer.", name: 'Lena Vogt', role: 'Street Triple · Berlin', avatar: `${IMG}/generated-1782059149683.png`, ring: '#3B82F6' },
  { quote: "Organising our club's rallies used to be chaos. Now everyone RSVPs and gets the route in one tap.", name: 'Iron Wolves MC', role: 'Club admin · Alps', avatar: `${IMG}/generated-1782059160111.png`, ring: '#22C55E' },
]
function Testimonials() {
  return (
    <section id="clubs" className="bg-bg">
      <div className="mx-auto max-w-[1240px] px-5 py-24 md:px-12">
        <SectionHead eyebrow="Loved by riders" title="RIDERS ARE TALKING" />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((tt, i) => (
            <Reveal key={tt.name} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <figure className="flex h-full flex-col gap-5 rounded-[22px] border border-border bg-surface p-8">
                <span className="text-warning">★★★★★</span>
                <blockquote className="flex-1 text-[16px] leading-relaxed text-text">{tt.quote}</blockquote>
                <figcaption className="flex items-center gap-3">
                  <img src={tt.avatar} alt={tt.name} className="h-11 w-11 rounded-full object-cover" style={{ boxShadow: `0 0 0 2px ${tt.ring}` }} />
                  <span>
                    <span className="block text-[15px] font-bold text-text">{tt.name}</span>
                    <span className="block text-[13px] text-text-muted">{tt.role}</span>
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
  return (
    <section id="pricing" className="relative isolate overflow-hidden" style={{ background: 'linear-gradient(120deg, #8B5CF6 0%, #6D28D9 50%, #3B1675 100%)' }}>
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[700px] w-[900px] -translate-x-1/2" style={{ background: 'radial-gradient(ellipse at top, #FFFFFF24, transparent 60%)' }} />
      <div className="relative mx-auto flex max-w-[1240px] flex-col items-center px-5 py-28 text-center md:px-12">
        <Reveal>
          <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-white/70">Free to download</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-4 font-display text-[clamp(40px,7vw,62px)] leading-[1.02] tracking-tight text-white">
            YOUR NEXT RIDE STARTS HERE
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-5 max-w-xl text-[19px] leading-relaxed text-white/90">
            Join 50,000+ riders already on the map. Download MotoMeet, find your crew and make every ride a meetup.
          </p>
        </Reveal>
        <Reveal delay={3}>
          <StoreButtons className="mt-9 justify-center" />
        </Reveal>
        <Reveal delay={4}>
          <p className="mt-6 text-sm font-medium text-white/85">★★★★★ 4.9 on the App Store · Free · No ads, ever</p>
        </Reveal>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Footer
const FOOT = {
  Product: ['Live map', 'Events & rallies', 'Clubs & crews', 'Route planner', 'Pricing'],
  Community: ['For riders', 'For clubs', 'Ride safety', 'Rider stories'],
  Company: ['About us', 'Careers', 'Press kit', 'Contact'],
}
function Footer() {
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
              The live map for the global motorcycle community. Find riders, join rallies, never ride alone.
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
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-text-muted">{head}</h4>
                <ul className="mt-4 flex flex-col gap-3">
                  {items.map((it) => (
                    <li key={it}>
                      <a href="#top" className="text-[15px] font-medium text-text-secondary transition-colors hover:text-text">
                        {it}
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
          <p className="text-[13px] text-text-muted">© 2026 MotoMeet. Made by riders, for riders.</p>
          <div className="flex gap-7">
            {['Privacy', 'Terms', 'Cookies'].map((l) => (
              <a key={l} href="#top" className="text-[13px] text-text-muted transition-colors hover:text-text">
                {l}
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
