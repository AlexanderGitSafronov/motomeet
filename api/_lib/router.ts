import { q, one } from './db'
import { hashPassword, verifyPassword, signToken, userIdFromAuth } from './auth'

export interface ApiResult {
  status: number
  body: unknown
}

const ok = (body: unknown = {}): ApiResult => ({ status: 200, body })
const created = (body: unknown): ApiResult => ({ status: 201, body })
const bad = (msg: string): ApiResult => ({ status: 400, body: { error: msg } })
const unauth = (): ApiResult => ({ status: 401, body: { error: 'Не авторизовано' } })
const notFound = (): ApiResult => ({ status: 404, body: { error: 'Не знайдено' } })

type Row = Record<string, any>

function serializeUser(r: Row, isFollowing = false): Row {
  return {
    id: r.id,
    name: r.name,
    handle: r.handle,
    avatar: r.avatar,
    bike: r.bike,
    bikeYear: r.bike_year ?? undefined,
    verified: r.verified,
    followers: Number(r.followers ?? r.base_followers ?? 0),
    following: Number(r.following ?? r.base_following ?? 0),
    rides: r.rides ?? 0,
    events: r.events_count ?? 0,
    distanceKm: r.distance_km ?? 0,
    ridingNow: r.riding_now ?? false,
    lastActive: r.last_active ?? undefined,
    location: r.location ?? undefined,
    category: r.category ?? undefined,
    online: r.online ?? false,
    pos: r.lat != null && r.lng != null ? [r.lat, r.lng] : undefined,
    latestRide: r.latest_ride ?? undefined,
    isFollowing,
  }
}

const FOLLOWERS = `(u.base_followers + (select count(*) from follows f where f.followee_id = u.id))`
const FOLLOWING = `(u.base_following + (select count(*) from follows f where f.follower_id = u.id))`

async function getMe(uid: string): Promise<Row | null> {
  const r = await one(
    `select u.*, ${FOLLOWERS} as followers, ${FOLLOWING} as following from users u where u.id = $1`,
    [uid]
  )
  return r
}

/** Core API router — framework-agnostic. */
export async function route(
  method: string,
  path: string,
  body: any,
  authHeader?: string
): Promise<ApiResult> {
  // strip leading /api
  const clean = path.replace(/^\/?api\/?/, '/').replace(/\/+$/, '') || '/'
  const seg = clean.split('/').filter(Boolean) // e.g. ['auth','login']
  const uid = userIdFromAuth(authHeader)

  // ---------- AUTH ----------
  if (seg[0] === 'auth') {
    if (seg[1] === 'register' && method === 'POST') {
      const { name, email, password } = body ?? {}
      if (!name?.trim() || !email?.trim() || !password) return bad('Заповніть усі поля')
      if (password.length < 6) return bad('Пароль має містити щонайменше 6 символів')
      const existing = await one(`select id from users where lower(email) = lower($1)`, [email])
      if (existing) return bad('Акаунт із такою поштою вже існує')
      const id = `u-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`
      const handle = '@' + (email.split('@')[0] || 'rider').toLowerCase().replace(/[^a-z0-9_]/g, '')
      const hash = await hashPassword(password)
      const avatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`
      await q(
        `insert into users (id,name,handle,email,password_hash,avatar,bike,location,online,distance_km,rides,events_count)
         values ($1,$2,$3,$4,$5,$6,$7,$8,true,0,0,0)`,
        [id, name.trim(), handle + '_' + id.slice(-4), email.trim(), hash, avatar, 'Новий райдер', 'Україна']
      )
      const me = await getMe(id)
      return created({ token: signToken(id), user: serializeUser(me!) })
    }

    if (seg[1] === 'login' && method === 'POST') {
      const { email, password } = body ?? {}
      const u = await one<Row>(`select * from users where lower(email) = lower($1)`, [email ?? ''])
      if (!u || !u.password_hash) return bad('Невірна пошта або пароль')
      const okPw = await verifyPassword(password ?? '', u.password_hash)
      if (!okPw) return bad('Невірна пошта або пароль')
      const me = await getMe(u.id)
      return ok({ token: signToken(u.id), user: serializeUser(me!) })
    }

    if (seg[1] === 'me' && method === 'GET') {
      if (!uid) return unauth()
      const me = await getMe(uid)
      if (!me) return unauth()
      return ok({ user: serializeUser(me) })
    }
  }

  if (!uid) return unauth()

  // ---------- PROFILE ----------
  if (seg[0] === 'profile' && method === 'PATCH') {
    const { name, bike, location } = body ?? {}
    await q(
      `update users set name = coalesce($2,name), bike = coalesce($3,bike), location = coalesce($4,location) where id = $1`,
      [uid, name ?? null, bike ?? null, location ?? null]
    )
    const me = await getMe(uid)
    return ok({ user: serializeUser(me!) })
  }

  // ---------- RIDERS ----------
  if (seg[0] === 'riders' && method === 'GET') {
    const rows = await q<Row>(
      `select u.*, ${FOLLOWERS} as followers, ${FOLLOWING} as following,
        exists(select 1 from follows f where f.follower_id = $1 and f.followee_id = u.id) as is_following
       from users u where u.id <> $1 order by u.distance_km asc, u.created_at desc`,
      [uid]
    )
    return ok({ riders: rows.map((r) => serializeUser(r, r.is_following)) })
  }

  // ---------- FOLLOW ----------
  if (seg[0] === 'follow' && seg[1]) {
    const target = seg[1]
    if (method === 'POST') {
      await q(`insert into follows (follower_id,followee_id) values ($1,$2) on conflict do nothing`, [uid, target])
      return ok({ following: true })
    }
    if (method === 'DELETE') {
      await q(`delete from follows where follower_id = $1 and followee_id = $2`, [uid, target])
      return ok({ following: false })
    }
  }

  // ---------- EVENTS ----------
  if (seg[0] === 'events') {
    if (seg.length === 1 && method === 'GET') {
      const rows = await q<Row>(
        `select e.*, (e.going + (select count(*) from event_participants p where p.event_id = e.id)) as going_total,
          exists(select 1 from event_participants p where p.event_id = e.id and p.user_id = $1) as joined
         from events e order by e.date asc`,
        [uid]
      )
      return ok({ events: rows.map(serializeEvent) })
    }
    if (seg[1] && seg[2] === 'join') {
      if (method === 'POST') {
        await q(`insert into event_participants (event_id,user_id) values ($1,$2) on conflict do nothing`, [seg[1], uid])
        return ok({ joined: true })
      }
      if (method === 'DELETE') {
        await q(`delete from event_participants where event_id = $1 and user_id = $2`, [seg[1], uid])
        return ok({ joined: false })
      }
    }
  }

  // ---------- CLUBS ----------
  if (seg[0] === 'clubs') {
    if (seg.length === 1 && method === 'GET') {
      const rows = await q<Row>(
        `select c.*, (c.members + (select count(*) from club_members m where m.club_id = c.id)) as members_total,
          exists(select 1 from club_members m where m.club_id = c.id and m.user_id = $1) as joined
         from clubs c order by c.members desc`,
        [uid]
      )
      return ok({ clubs: rows.map(serializeClub) })
    }
    if (seg[1] && seg[2] === 'join') {
      if (method === 'POST') {
        await q(`insert into club_members (club_id,user_id) values ($1,$2) on conflict do nothing`, [seg[1], uid])
        return ok({ joined: true })
      }
      if (method === 'DELETE') {
        await q(`delete from club_members where club_id = $1 and user_id = $2`, [seg[1], uid])
        return ok({ joined: false })
      }
    }
  }

  // ---------- DIRECT MESSAGES ----------
  if (seg[0] === 'messages') {
    const other = seg[1]
    if (other && method === 'GET') {
      const rows = await q<Row>(
        `select * from messages where (sender_id=$1 and recipient_id=$2) or (sender_id=$2 and recipient_id=$1) order by id asc`,
        [uid, other]
      )
      return ok({ messages: rows.map((m) => serializeMessage(m, uid)) })
    }
    if (other && method === 'POST') {
      const { text, image } = body ?? {}
      if (!text?.trim() && !image) return bad('Порожнє повідомлення')
      await q(`insert into messages (sender_id,recipient_id,kind,text,image) values ($1,$2,$3,$4,$5)`, [
        uid, other, image ? 'image' : 'text', image ? null : text.trim(), image ?? null,
      ])
      return created({ ok: true })
    }
  }

  // ---------- CONVERSATIONS LIST ----------
  if (seg[0] === 'conversations' && method === 'GET') {
    const rows = await q<Row>(
      `select u.id, u.name, u.avatar, u.online,
        (select text from messages m where (m.sender_id=u.id and m.recipient_id=$1) or (m.sender_id=$1 and m.recipient_id=u.id) order by m.id desc limit 1) as last_message,
        (select kind from messages m where (m.sender_id=u.id and m.recipient_id=$1) or (m.sender_id=$1 and m.recipient_id=u.id) order by m.id desc limit 1) as last_kind
       from users u
       where u.id <> $1 and exists(select 1 from messages m where (m.sender_id=u.id and m.recipient_id=$1) or (m.sender_id=$1 and m.recipient_id=u.id))
       order by (select max(m.id) from messages m where (m.sender_id=u.id and m.recipient_id=$1) or (m.sender_id=$1 and m.recipient_id=u.id)) desc`,
      [uid]
    )
    return ok({
      conversations: rows.map((r) => ({
        id: `cv-${r.id}`,
        riderId: r.id,
        name: r.name,
        avatar: r.avatar,
        online: r.online,
        lastMessage: r.last_kind === 'image' ? 'Фото' : r.last_message,
        lastKind: r.last_kind,
        time: '',
      })),
    })
  }

  // ---------- COMMUNITY CHANNEL ----------
  if (seg[0] === 'channel') {
    if (method === 'GET') {
      const rows = await q<Row>(`select * from channel_messages order by id asc`)
      return ok({ messages: rows.map((m) => serializeChannelMessage(m, uid)) })
    }
    if (method === 'POST') {
      const { text, image } = body ?? {}
      if (!text?.trim() && !image) return bad('Порожнє повідомлення')
      const me = await getMe(uid)
      await q(
        `insert into channel_messages (channel,author_id,author_name,author_avatar,kind,text,image,time_label)
         values ('Мюнхен',$1,$2,$3,$4,$5,$6,'зараз')`,
        [uid, me?.name ?? 'Ви', me?.avatar ?? '', image ? 'image' : 'text', image ? null : text.trim(), image ?? null]
      )
      return created({ ok: true })
    }
  }

  // ---------- NOTIFICATIONS ----------
  if (seg[0] === 'notifications') {
    if (seg.length === 1 && method === 'GET') {
      const rows = await q<Row>(`select * from notifications where user_id = $1 order by sort desc`, [uid])
      return ok({ notifications: rows.map(serializeNotification) })
    }
    if (seg[1] === 'read-all' && method === 'POST') {
      await q(`update notifications set read = true where user_id = $1`, [uid])
      return ok({ ok: true })
    }
    if (seg[1] && seg[2] === 'read' && method === 'POST') {
      await q(`update notifications set read = true where user_id = $1 and id = $2`, [uid, seg[1]])
      return ok({ ok: true })
    }
  }

  // ---------- ROUTES ----------
  if (seg[0] === 'routes') {
    if (seg.length === 1 && method === 'GET') {
      const rows = await q<Row>(`select * from routes where user_id = $1 order by created_at desc`, [uid])
      return ok({ routes: rows.map(serializeRoute) })
    }
    if (seg.length === 1 && method === 'POST') {
      const { title, from, to, distanceKm, duration, stops } = body ?? {}
      if (!title?.trim()) return bad('Вкажіть назву маршруту')
      const id = `rt-${Date.now().toString(36)}`
      await q(
        `insert into routes (id,user_id,title,from_loc,to_loc,distance_km,duration,stops) values ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [id, uid, title.trim(), from ?? '', to ?? '', distanceKm ?? 0, duration ?? '', stops ?? 2]
      )
      return created({ id })
    }
    if (seg[1] && method === 'DELETE') {
      await q(`delete from routes where user_id = $1 and id = $2`, [uid, seg[1]])
      return ok({ ok: true })
    }
  }

  // ---------- GALLERY ----------
  if (seg[0] === 'gallery') {
    if (seg.length === 1 && method === 'GET') {
      const rows = await q<Row>(`select * from gallery_photos where user_id = $1 order by sort desc, id desc`, [uid])
      return ok({ gallery: rows.map((r) => ({ id: String(r.id), url: r.url })) })
    }
    if (seg.length === 1 && method === 'POST') {
      const { url } = body ?? {}
      if (!url) return bad('Немає зображення')
      const r = await one<Row>(
        `insert into gallery_photos (user_id,url,sort) values ($1,$2,(select coalesce(max(sort),0)+1 from gallery_photos where user_id=$1)) returning id`,
        [uid, url]
      )
      return created({ id: String(r!.id) })
    }
    if (seg[1] && method === 'DELETE') {
      await q(`delete from gallery_photos where user_id = $1 and id = $2`, [uid, Number(seg[1])])
      return ok({ ok: true })
    }
  }

  return notFound()
}

// ---- serializers for the remaining entities ----
function serializeEvent(e: Row) {
  return {
    id: e.id,
    title: e.title,
    category: e.category,
    categoryLabel: e.category_label,
    cover: e.cover,
    date: typeof e.date === 'string' ? e.date : new Date(e.date).toISOString(),
    location: e.location,
    city: e.city,
    hostClubId: e.host_club_id ?? undefined,
    going: Number(e.going_total ?? e.going),
    goingAvatars: e.going_avatars ?? [],
    distanceKm: e.distance_km ?? undefined,
    duration: e.duration ?? undefined,
    priceLabel: e.price_label,
    startsInLabel: e.starts_in_label ?? undefined,
    description: e.description,
    pos: e.lat != null && e.lng != null ? [e.lat, e.lng] : undefined,
    routePath: e.route_path ?? undefined,
    joined: e.joined ?? false,
  }
}

function serializeClub(c: Row) {
  return {
    id: c.id,
    name: c.name,
    verified: c.verified,
    city: c.city,
    members: Number(c.members_total ?? c.members),
    online: c.online,
    icon: c.icon,
    gradient: c.gradient,
    category: c.category,
    pos: c.lat != null && c.lng != null ? [c.lat, c.lng] : undefined,
    joined: c.joined ?? false,
  }
}

function serializeMessage(m: Row, uid: string) {
  return {
    id: `m-${m.id}`,
    authorId: m.sender_id,
    authorName: '',
    authorAvatar: '',
    self: m.sender_id === uid,
    kind: m.kind,
    text: m.text ?? undefined,
    image: m.image ?? undefined,
    time: '',
  }
}

function serializeChannelMessage(m: Row, uid: string) {
  return {
    id: `cm-${m.id}`,
    authorId: m.author_id,
    authorName: m.author_name,
    authorAvatar: m.author_avatar,
    self: m.author_id === uid,
    kind: m.kind,
    text: m.text ?? undefined,
    image: m.image ?? undefined,
    voiceDuration: m.voice_duration ?? undefined,
    reactions: m.reactions ?? undefined,
    time: m.time_label ?? '',
  }
}

function serializeNotification(n: Row) {
  return {
    id: n.id,
    kind: n.kind,
    text: n.text,
    time: n.time_label,
    unread: !n.read,
    group: n.grp,
    filter: n.filter,
  }
}

function serializeRoute(r: Row) {
  return {
    id: r.id,
    title: r.title,
    from: r.from_loc,
    to: r.to_loc,
    distanceKm: r.distance_km,
    duration: r.duration,
    stops: r.stops,
  }
}
