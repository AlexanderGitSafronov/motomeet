/**
 * Creates the MotoMeet schema in Postgres (Neon) and seeds it from the mock
 * data. Run with: `npx tsx scripts/migrate.ts` (reads DATABASE_URL from .env).
 */
import { readFileSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'
import { hashPassword } from '../api/_lib/auth'
import {
  currentUser,
  riders,
  clubs,
  events,
  notifications,
  routes,
  gallery,
  communitySeedMessages,
  conversations,
} from '../src/data/mock'

// ---- load DATABASE_URL ----
function loadEnv() {
  if (process.env.DATABASE_URL) return
  try {
    const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
    for (const line of txt.split('\n')) {
      const m = line.match(/^([A-Z_]+)=(.*)$/)
      if (m) process.env[m[1]] = m[2]
    }
  } catch {
    /* ignore */
  }
}
loadEnv()

const sql = neon(process.env.DATABASE_URL!)
const DEFAULT_PASSWORD = 'ridetogether'

/** Run a multi-statement SQL block one statement at a time (Neon HTTP limit). */
async function exec(multi: string) {
  for (const stmt of multi.split(';').map((s) => s.trim()).filter(Boolean)) {
    await sql.query(stmt)
  }
}

// Markus is the primary demo account.
const ME = { ...currentUser, id: 'u-markus', email: 'markus@motomeet.cc' }

async function run() {
  console.log('Dropping & creating schema…')
  await exec(`
    drop table if exists gallery_photos, routes, notifications, channel_messages, messages,
      event_participants, events, club_members, clubs, follows, users cascade;
  `)

  await exec(`
    create table users (
      id text primary key,
      name text not null,
      handle text unique not null,
      email text unique,
      password_hash text,
      avatar text,
      bike text,
      bike_year int,
      verified boolean default false,
      location text,
      category text,
      online boolean default false,
      lat double precision,
      lng double precision,
      distance_km double precision default 0,
      rides int default 0,
      events_count int default 0,
      base_followers int default 0,
      base_following int default 0,
      riding_now boolean default false,
      last_active text,
      latest_ride jsonb,
      created_at timestamptz default now()
    );
    create table follows (
      follower_id text references users(id) on delete cascade,
      followee_id text references users(id) on delete cascade,
      primary key (follower_id, followee_id)
    );
    create table clubs (
      id text primary key, name text, verified boolean, city text,
      members int, online int, icon text, gradient text, category text,
      lat double precision, lng double precision
    );
    create table club_members (
      club_id text references clubs(id) on delete cascade,
      user_id text references users(id) on delete cascade,
      primary key (club_id, user_id)
    );
    create table events (
      id text primary key, title text, category text, category_label text,
      cover text, date timestamptz, location text, city text, host_club_id text,
      going int, going_avatars jsonb, distance_km double precision, duration text,
      price_label text, starts_in_label text, description text,
      lat double precision, lng double precision, route_path jsonb
    );
    create table event_participants (
      event_id text references events(id) on delete cascade,
      user_id text references users(id) on delete cascade,
      primary key (event_id, user_id)
    );
    create table messages (
      id bigserial primary key, sender_id text, recipient_id text,
      kind text, text text, image text, created_at timestamptz default now()
    );
    create table channel_messages (
      id bigserial primary key, channel text, author_id text, author_name text, author_avatar text,
      kind text, text text, image text, voice_duration int, reactions jsonb, time_label text,
      created_at timestamptz default now()
    );
    create table notifications (
      id text primary key, user_id text, kind text, text text, time_label text,
      grp text, filter text, read boolean default false, sort int default 0
    );
    create table routes (
      id text primary key, user_id text, title text, from_loc text, to_loc text,
      distance_km double precision, duration text, stops int, created_at timestamptz default now()
    );
    create table gallery_photos (
      id bigserial primary key, user_id text, url text, sort int default 0, created_at timestamptz default now()
    );
  `)

  const hash = await hashPassword(DEFAULT_PASSWORD)

  console.log('Seeding users…')
  const allUsers = [ME, ...riders]
  for (const u of allUsers) {
    const email = u.email ?? `${u.handle.replace('@', '')}@motomeet.cc`
    await sql.query(
      `insert into users (id,name,handle,email,password_hash,avatar,bike,bike_year,verified,location,category,online,lat,lng,distance_km,rides,events_count,base_followers,base_following,riding_now,last_active,latest_ride)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)`,
      [
        u.id, u.name, u.handle, email, hash, u.avatar, u.bike, u.bikeYear ?? null, u.verified ?? false,
        u.location ?? null, u.category ?? null, u.online ?? false,
        u.pos?.[0] ?? null, u.pos?.[1] ?? null, u.distanceKm ?? 0, u.rides ?? 0, u.events ?? 0,
        u.followers ?? 0, u.following ?? 0, u.ridingNow ?? false, u.lastActive ?? null,
        u.latestRide ? JSON.stringify(u.latestRide) : null,
      ]
    )
  }

  console.log('Seeding clubs…')
  for (const c of clubs) {
    await sql.query(
      `insert into clubs (id,name,verified,city,members,online,icon,gradient,category,lat,lng)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [c.id, c.name, c.verified ?? false, c.city, c.members, c.online ?? 0, c.icon, c.gradient, c.category, c.pos?.[0] ?? null, c.pos?.[1] ?? null]
    )
  }
  // Markus is a member of Night Owls by default
  await sql.query(`insert into club_members (club_id,user_id) values ('c-nightowls',$1) on conflict do nothing`, [ME.id])

  console.log('Seeding events…')
  for (const e of events) {
    await sql.query(
      `insert into events (id,title,category,category_label,cover,date,location,city,host_club_id,going,going_avatars,distance_km,duration,price_label,starts_in_label,description,lat,lng,route_path)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
      [
        e.id, e.title, e.category, e.categoryLabel, e.cover, e.date, e.location, e.city, e.hostClubId ?? null,
        e.going, JSON.stringify(e.goingAvatars), e.distanceKm ?? null, e.duration ?? null, e.priceLabel,
        e.startsInLabel ?? null, e.description, e.pos?.[0] ?? null, e.pos?.[1] ?? null,
        e.routePath ? JSON.stringify(e.routePath) : null,
      ]
    )
  }

  console.log('Seeding follows…')
  // Markus follows Diego by default (matches the original demo state)
  await sql.query(`insert into follows (follower_id,followee_id) values ($1,'r-diego') on conflict do nothing`, [ME.id])

  console.log('Seeding notifications…')
  let nsort = notifications.length
  for (const n of notifications) {
    await sql.query(
      `insert into notifications (id,user_id,kind,text,time_label,grp,filter,read,sort)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [n.id, ME.id, n.kind, n.text, n.time, n.group, n.filter, false, nsort--]
    )
  }

  console.log('Seeding routes…')
  const r0 = routes[0]
  await sql.query(
    `insert into routes (id,user_id,title,from_loc,to_loc,distance_km,duration,stops)
     values ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [r0.id, ME.id, r0.title, r0.stops[0].title, r0.stops[r0.stops.length - 1].title, r0.distanceKm, r0.duration, r0.stops.length]
  )

  console.log('Seeding gallery…')
  let gsort = gallery.length
  for (const url of gallery) {
    await sql.query(`insert into gallery_photos (user_id,url,sort) values ($1,$2,$3)`, [ME.id, url, gsort--])
  }

  console.log('Seeding community channel…')
  for (const m of communitySeedMessages) {
    await sql.query(
      `insert into channel_messages (channel,author_id,author_name,author_avatar,kind,text,image,voice_duration,reactions,time_label)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        'Мюнхен', m.authorId === 'me' ? ME.id : m.authorId, m.authorName, m.authorAvatar, m.kind,
        m.text ?? null, m.image ?? null, m.voiceDuration ?? null,
        m.reactions ? JSON.stringify(m.reactions) : null, m.time,
      ]
    )
  }

  console.log('Seeding direct messages…')
  // a couple of seed DM threads from riders to Markus
  const dmSeeds: Array<[string, string]> = [
    ['r-lena', 'Виїжджаю з Мюнхена о 8:00 — хто в колону?'],
    ['r-diego', 'Глянь на цей краєвид зі вчора'],
  ]
  void conversations
  for (const [sender, text] of dmSeeds) {
    await sql.query(
      `insert into messages (sender_id,recipient_id,kind,text) values ($1,$2,'text',$3)`,
      [sender, ME.id, text]
    )
  }

  const [{ count }] = (await sql.query(`select count(*)::int as count from users`)) as { count: number }[]
  console.log(`✅ Done. ${count} users seeded. Demo login: markus@motomeet.cc / ${DEFAULT_PASSWORD}`)
}

run().catch((e) => {
  console.error('Migration failed:', e)
  process.exit(1)
})
