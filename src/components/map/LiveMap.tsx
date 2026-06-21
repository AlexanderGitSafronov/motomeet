import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { MAP_CENTER } from '@/data/mock'
import type { Rider } from '@/data/types'
import { riderMarker, eventMarker, clubMarker, clusterMarker, meMarker } from './markers'

const TILES = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
}

const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

/** Keeps Leaflet sized correctly when its container changes (responsive shell). */
function ResizeHandler() {
  const map = useMap()
  useEffect(() => {
    const onResize = () => map.invalidateSize()
    window.addEventListener('resize', onResize)
    const t = setTimeout(onResize, 200)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(t)
    }
  }, [map])
  return null
}

interface LiveMapProps {
  onRiderClick?: (rider: Rider) => void
  onEventClick?: (eventId: string) => void
  onClubClick?: (clubId: string) => void
  showEvents?: boolean
  showClubs?: boolean
  showRiders?: boolean
  routePath?: LatLngExpression[]
  center?: [number, number]
  zoom?: number
  interactive?: boolean
  className?: string
}

export function LiveMap({
  onRiderClick,
  onEventClick,
  onClubClick,
  showEvents = true,
  showClubs = true,
  showRiders = true,
  routePath,
  center = MAP_CENTER,
  zoom = 14,
  interactive = true,
  className,
}: LiveMapProps) {
  const theme = useAppStore((s) => s.theme)
  const riders = useAppStore((s) => s.riders)
  const events = useAppStore((s) => s.events)
  const clubs = useAppStore((s) => s.clubs)
  const ridersWithPos = useMemo(() => riders.filter((r) => r.pos), [riders])

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      attributionControl
      dragging={interactive}
      scrollWheelZoom={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      className={className ?? 'h-full w-full'}
      style={{ background: 'var(--mm-map-bg)' }}
    >
      <TileLayer url={theme === 'light' ? TILES.light : TILES.dark} attribution={ATTRIBUTION} />
      <ResizeHandler />

      {/* Me */}
      <Marker position={center} icon={meMarker()} interactive={false} />

      {/* Riders */}
      {showRiders &&
        ridersWithPos.map((r) => (
          <Marker
            key={r.id}
            position={r.pos as LatLngExpression}
            icon={riderMarker(r.avatar, r.ridingNow)}
            eventHandlers={{ click: () => onRiderClick?.(r) }}
          />
        ))}

      {/* Events */}
      {showEvents &&
        events.filter((e) => e.pos).map((e) => (
          <Marker
            key={e.id}
            position={e.pos as LatLngExpression}
            icon={eventMarker()}
            interactive={!!onEventClick}
            eventHandlers={onEventClick ? { click: () => onEventClick(e.id) } : undefined}
          />
        ))}

      {/* Clubs */}
      {showClubs &&
        clubs.filter((c) => c.pos).map((c) => (
          <Marker
            key={c.id}
            position={c.pos as LatLngExpression}
            icon={clubMarker()}
            interactive={!!onClubClick}
            eventHandlers={onClubClick ? { click: () => onClubClick(c.id) } : undefined}
          />
        ))}

      {/* A cluster pill to the south-west, as in the mockup */}
      {showRiders && (
        <Marker position={[48.1262, 11.5615]} icon={clusterMarker(24)} interactive={false} />
      )}

      {/* Optional route polyline */}
      {routePath && routePath.length > 1 && (
        <Polyline
          positions={routePath}
          pathOptions={{ color: '#8b5cf6', weight: 5, opacity: 0.9, lineCap: 'round' }}
        />
      )}
    </MapContainer>
  )
}
