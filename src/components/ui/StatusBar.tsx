/**
 * In the MotoMeet.pen mockups the "9:41 · signal · wifi · battery" row is part
 * of the *device frame* (a presentation mock), not the app UI. A real PWA must
 * never draw its own status bar — the OS renders it. So this component renders
 * only a small top spacer; the surrounding `pt-safe` wrappers handle the notch
 * inset on installed/standalone devices.
 */
export function StatusBar() {
  return <div aria-hidden className="h-2.5" />
}
