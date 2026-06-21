/** Place lookup via OpenStreetMap Nominatim (free, no API key). */
export interface Place {
  name: string
  short: string
  city: string
  lat: number
  lng: number
}

type NominatimResult = {
  display_name: string
  lat: string
  lon: string
  name?: string
  address?: Record<string, string>
}

export interface RouteResult {
  /** Polyline points as [lat, lng]. */
  path: [number, number][]
  distanceKm: number
  durationMin: number
}

interface LatLng {
  lat: number
  lng: number
}

/** Great-circle distance in km between two points. */
function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/**
 * Plot a driving route between two points via OSRM (free, no key).
 * Falls back to a straight line + haversine distance if routing is unavailable.
 */
export async function routeBetween(from: LatLng, to: LatLng, signal?: AbortSignal): Promise<RouteResult> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}` +
    `?overview=full&geometries=geojson`
  try {
    const res = await fetch(url, { signal })
    if (res.ok) {
      const data = (await res.json()) as {
        routes?: { distance: number; duration: number; geometry: { coordinates: [number, number][] } }[]
      }
      const route = data.routes?.[0]
      if (route?.geometry?.coordinates?.length) {
        const path = route.geometry.coordinates.map((c) => [c[1], c[0]] as [number, number])
        return { path, distanceKm: route.distance / 1000, durationMin: route.duration / 60 }
      }
    }
  } catch {
    /* fall through to straight-line estimate */
  }
  const distanceKm = haversineKm(from, to)
  return {
    path: [
      [from.lat, from.lng],
      [to.lat, to.lng],
    ],
    distanceKm,
    durationMin: (distanceKm / 65) * 60, // ~65 km/h touring average
  }
}

/** Search places by free-text query. Returns up to 5 matches. */
export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const q = query.trim()
  if (q.length < 3) return []
  const url =
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=uk,en&q=${encodeURIComponent(q)}`
  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (!res.ok) return []
    const data = (await res.json()) as NominatimResult[]
    return data.map((d) => {
      const a = d.address ?? {}
      const city = a.city || a.town || a.village || a.municipality || a.county || ''
      const country = a.country || ''
      const primary = d.name || d.display_name.split(',')[0]
      const short = [primary, city && city !== primary ? city : null, country].filter(Boolean).join(', ')
      return { name: d.display_name, short, city: city || primary, lat: parseFloat(d.lat), lng: parseFloat(d.lon) }
    })
  } catch {
    return []
  }
}
