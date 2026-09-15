/**
 * Visitor accessibility preferences.
 *
 * Everything is expressed as a `data-*` attribute on <html> so the whole cascade
 * is CSS — no component needs to know a preference exists. The theme reuses
 * Once UI's own `data-theme` key and localStorage slot so its provider and this
 * panel can never disagree about which theme is active.
 */

export type ThemeChoice = 'dark' | 'light' | 'system'
export type ContrastChoice = 'normal' | 'high'
export type TextSize = '90' | '100' | '110'
export type MotionChoice = 'full' | 'reduced'

export interface A11yPrefs {
  theme: ThemeChoice
  contrast: ContrastChoice
  textSize: TextSize
  motion: MotionChoice
  underlineLinks: boolean
}

export const DEFAULT_PREFS: A11yPrefs = {
  theme: 'dark',
  contrast: 'normal',
  textSize: '100',
  motion: 'full',
  underlineLinks: false,
}

/**
 * Once UI reads these keys too (see ThemeInit/ThemeProvider), so any preference
 * it also owns is written to its slot rather than only to ours. Keeping the text
 * size solely in our own blob let its provider reset `data-scaling` to the
 * default on mount, silently undoing the control a moment after it was used.
 */
export const THEME_KEY = 'data-theme'
export const SCALING_KEY = 'data-scaling'
export const PREFS_KEY = 'harriscom-a11y'

export function readPrefs(): A11yPrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS
  try {
    const raw = window.localStorage.getItem(PREFS_KEY)
    const stored = raw ? (JSON.parse(raw) as Partial<A11yPrefs>) : {}
    const theme = window.localStorage.getItem(THEME_KEY) as ThemeChoice | null
    return {
      ...DEFAULT_PREFS,
      ...stored,
      theme: theme === 'light' || theme === 'dark' ? theme : stored.theme ?? 'system',
    }
  } catch {
    return DEFAULT_PREFS
  }
}

export function applyPrefs(prefs: A11yPrefs) {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  const resolvedTheme =
    prefs.theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
      : prefs.theme

  root.setAttribute('data-theme', resolvedTheme)
  root.setAttribute('data-contrast', prefs.contrast)
  root.setAttribute('data-scaling', prefs.textSize)
  root.setAttribute('data-motion', prefs.motion)
  root.setAttribute('data-underline-links', String(prefs.underlineLinks))

  try {
    // "system" means *stop* pinning a theme, so the key is removed rather than
    // set — that is also what Once UI's provider expects.
    if (prefs.theme === 'system') window.localStorage.removeItem(THEME_KEY)
    else window.localStorage.setItem(THEME_KEY, prefs.theme)
    window.localStorage.setItem(SCALING_KEY, prefs.textSize)
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {
    // Storage disabled: preferences apply for this page view only.
  }
}

/**
 * Runs before first paint, inlined in <head>. Duplicating a little of
 * applyPrefs here is deliberate — importing a module would mean a flash of the
 * wrong theme while the bundle loads.
 */
export const A11Y_INIT_SCRIPT = `(function(){
  try {
    var root = document.documentElement;
    var prefs = {};
    try { prefs = JSON.parse(localStorage.getItem('${PREFS_KEY}')) || {}; } catch (e) {}
    var stored = localStorage.getItem('${THEME_KEY}');
    var theme = stored || prefs.theme || '${DEFAULT_PREFS.theme}';
    if (theme === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } else {
      // Persist the default on a first visit so Once UI's provider resolves the
      // same theme this script just painted.
      localStorage.setItem('${THEME_KEY}', theme);
    }
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-contrast', prefs.contrast || '${DEFAULT_PREFS.contrast}');
    var scaling = prefs.textSize || '${DEFAULT_PREFS.textSize}';
    root.setAttribute('data-scaling', scaling);
    // Mirrored into Once UI's own slot, or its provider resets it on mount.
    localStorage.setItem('${SCALING_KEY}', scaling);
    root.setAttribute('data-motion', prefs.motion || '${DEFAULT_PREFS.motion}');
    root.setAttribute('data-underline-links', String(prefs.underlineLinks === true));
  } catch (e) {
    document.documentElement.setAttribute('data-theme', '${DEFAULT_PREFS.theme}');
  }
})();`
