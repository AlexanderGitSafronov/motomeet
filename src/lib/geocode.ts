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
