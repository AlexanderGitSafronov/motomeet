/** Domain types for MotoMeet. */

export type ID = string

export interface Rider {
  id: ID
  name: string
  handle: string
  avatar: string
  bike: string
  bikeYear?: number
  verified?: boolean
  followers: number
  following: number
  rides: number
  events: number
  distanceKm: number // distance away from "me"
  ridingNow?: boolean
  lastActive?: string
  location?: string
  category?: 'sport' | 'touring' | 'adventure' | 'cruiser'
  online?: boolean
  /** map coordinates [lat, lng] */
  pos?: [number, number]
  latestRide?: {
    title: string
    distanceKm: number
    cover: string
  }
}

export type EventCategory = 'rally' | 'track' | 'tour' | 'meetup'

export interface RideEvent {
  id: ID
  title: string
  category: EventCategory
  categoryLabel: string
  cover: string
  date: string // ISO
  location: string
  city: string
  hostClubId?: ID
  going: number
  goingAvatars: string[]
  distanceKm?: number
  duration?: string
  priceLabel: string
  startsInLabel?: string
  description: string
  pos?: [number, number]
  routePath?: [number, number][]
}

export interface Club {
  id: ID
  name: string
  verified?: boolean
  city: string
  members: number
  online?: number
  joined?: boolean
  icon: 'shield' | 'mountain' | 'moon' | 'compass' | 'gauge'
  gradient: string // tailwind gradient classes
  category: 'touring' | 'adventure' | 'track' | 'cruiser'
  pos?: [number, number]
}

export interface ChatMessage {
  id: ID
  authorId: ID
  authorName: string
  authorAvatar: string
  time: string
  self?: boolean
  kind: 'text' | 'image' | 'voice'
  text?: string
  image?: string
  voiceDuration?: number // seconds
  reactions?: { emoji: string; count: number }[]
}

export interface Conversation {
  id: ID
  riderId: ID
  name: string
  avatar: string
  online?: boolean
  lastMessage: string
  lastKind?: 'text' | 'image' | 'voice'
  time: string
  unread?: number
}

export type NotificationKind =
  | 'follow'
  | 'event'
  | 'nearby'
  | 'like'
  | 'badge'
  | 'message'
  | 'approved'

export interface AppNotification {
  id: ID
  kind: NotificationKind
  text: string
  time: string
  unread?: boolean
  group: 'new' | 'earlier'
  filter: 'following' | 'events' | 'other'
}

export interface RouteStop {
  id: ID
  kind: 'start' | 'coffee' | 'viewpoint' | 'finish' | 'fuel'
  title: string
  subtitle: string
  time: string
}

export interface Route {
  id: ID
  title: string
  distanceKm: number
  duration: string
  stops: RouteStop[]
  companions: number
  companionAvatars: string[]
  active?: boolean
  path: [number, number][]
}

export interface SavedRoute {
  id: ID
  title: string
  from: string
  to: string
  distanceKm: number
  duration: string
  stops: number
}

export interface Achievement {
  id: ID
  label: string
  icon: 'medal' | 'flame' | 'mountain' | 'users'
  earned: boolean
}
