import L from 'leaflet'

/** Avatar marker — circular photo with a violet ring and a pointer tail. */
export function riderMarker(avatar: string, riding = false): L.DivIcon {
  const ring = riding ? 'var(--mm-primary)' : 'var(--mm-accent)'
  return L.divIcon({
    className: 'mm-marker',
    html: `
      <div style="position:relative;width:48px;height:56px;">
        <div style="
          width:44px;height:44px;border-radius:50%;
          border:3px solid ${ring};
          box-shadow:0 6px 18px -4px ${riding ? 'rgba(139,92,246,.7)' : 'rgba(59,130,246,.55)'};
          background:url('${avatar}') center/cover;background-color:#273548;">
        </div>
        <div style="
          position:absolute;left:50%;bottom:2px;transform:translateX(-50%);
          width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;
          border-top:9px solid ${ring};"></div>
      </div>`,
    iconSize: [48, 56],
    iconAnchor: [24, 54],
  })
}

/** Event marker — violet circle with a flame glyph. */
export function eventMarker(): L.DivIcon {
  return L.divIcon({
    className: 'mm-marker',
    html: `
      <div style="
        width:44px;height:44px;border-radius:50%;
        display:grid;place-items:center;
        background:linear-gradient(135deg,#8b5cf6,#7c3aed);
        box-shadow:0 8px 22px -4px rgba(139,92,246,.8);border:2px solid rgba(255,255,255,.25);">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
      </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  })
}

/** Club marker — accent (blue) circle with a shield/layers glyph. */
export function clubMarker(): L.DivIcon {
  return L.divIcon({
    className: 'mm-marker',
    html: `
      <div style="
        width:44px;height:44px;border-radius:50%;
        display:grid;place-items:center;
        background:linear-gradient(135deg,#3b82f6,#2563eb);
        box-shadow:0 8px 22px -4px rgba(59,130,246,.7);border:2px solid rgba(255,255,255,.25);">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
        </svg>
      </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  })
}

/** Cluster marker — dark pill with a count. */
export function clusterMarker(count: number): L.DivIcon {
  return L.divIcon({
    className: 'mm-marker',
    html: `
      <div style="
        min-width:46px;height:46px;padding:0 6px;border-radius:23px;
        display:grid;place-items:center;
        background:var(--mm-glass);backdrop-filter:blur(10px);
        border:1px solid var(--mm-glass-border);
        box-shadow:0 8px 22px -6px rgba(0,0,0,.6);
        color:var(--mm-text);font-weight:800;font-size:16px;font-family:Inter,sans-serif;">
        ${count}
      </div>`,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
  })
}

/** "Me" marker — pulsing blue dot. */
export function meMarker(): L.DivIcon {
  return L.divIcon({
    className: 'mm-marker',
    html: `
      <div style="position:relative;width:26px;height:26px;">
        <span style="position:absolute;inset:0;border-radius:50%;background:rgba(59,130,246,.35);animation:mm-pulse 2.2s ease-out infinite;"></span>
        <span style="position:absolute;inset:5px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 2px rgba(59,130,246,.5);"></span>
      </div>
      <style>@keyframes mm-pulse{0%{transform:scale(.6);opacity:.8}100%{transform:scale(2.4);opacity:0}}</style>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}
