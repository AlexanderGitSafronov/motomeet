/**
 * Central registry of the AI-generated photography (lives in /public/img).
 * Keys are semantic so screens never reference raw filenames.
 * Categorization mirrors the original MotoMeet.pen photo assignments.
 */
const base = '/img'

export const img = {
  // ---- rider portraits (avatars) ----
  marcus: `${base}/generated-1782042827203.png`, // bearded man, leather jacket, night city
  diego: `${base}/generated-1782043023181.png`, // smiling man, helmet, neon city
  sofia: `${base}/generated-1782042957539.png`, // redhead woman, cobbled street
  lena: `${base}/generated-1782042937014.png`, // short-haired woman, neon city
  aiko: `${base}/generated-1782042988265.png`, // woman short hair, neon night
  kwame: `${base}/generated-1782042946253.png`, // man dreadlocks, mountain pass
  hans: `${base}/generated-1782042923717.png`, // older bearded biker, rally
  luca: `${base}/generated-1782042964168.png`, // man sunglasses, racing suit
  rider9: `${base}/generated-1782042970058.png`, // smiling man, helmet neon
  rider10: `${base}/generated-1782042999920.png`, // man dreadlocks, adventure bike
  rider11: `${base}/generated-1782043011450.png`, // redhead woman, holding helmet
  rider12: `${base}/generated-1782042952276.png`, // blonde woman, sunset road
  rider13: `${base}/generated-1782042910794.png`, // man sunglasses, on bike
  rider14: `${base}/generated-1782042976358.png`, // older bearded biker, vest
  rider15: `${base}/generated-1782042900434.png`, // smiling woman, coastal sunset

  // ---- event / scenic banners ----
  alpineRally: `${base}/generated-1782043055603.png`, // alpine switchback sunset
  rallyWeek: `${base}/generated-1782043066853.png`, // rally week aerial crowd
  coastalRide: `${base}/generated-1782043077940.png`, // coastal road sunset (wide)
  mountainOverlook: `${base}/generated-1782043118017.png`, // riders mountain overlook
  neonCity: `${base}/generated-1782043129468.png`, // rainy neon city street
  trackRace: `${base}/generated-1782043141967.png`, // superbikes track corner
  bikePurple1: `${base}/generated-1782043153001.png`, // purple naked bike studio
  advTrail: `${base}/generated-1782043162621.png`, // adventure bike stormy trail
  bikePurple2: `${base}/generated-1782043171908.png`, // purple naked bike studio
  forestRoad: `${base}/generated-1782043173429.png`, // winding forest road aerial
  dolomites: `${base}/generated-1782043184841.png`, // rider dolomites gravel
  forestRoad2: `${base}/generated-1782043195824.png`, // winding forest road (portrait)

  // ---- maps ----
  mapNav: `${base}/generated-1782043879385.png`, // phone navigation map
  mapPurpleRoute: `${base}/generated-1782043891890.png`, // dark city map purple route
  mapAerial: `${base}/generated-1782043962634.png`, // dark aerial city map
  mapCyanRoute: `${base}/generated-1782043973413.png`, // dark city map cyan route
} as const

export type ImageKey = keyof typeof img
