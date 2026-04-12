/**
 * Dev-only: warn when inline `style` attributes set raw colors (hex/rgb/hsl),
 * which bypass design tokens and break theming consistency.
 */
const INLINE_COLOR_RE =
  /\b(?:color|background(?:-color)?|border(?:-color)?|fill|stroke|outline(?:-color)?|box-shadow)\s*:\s*[^;{}]*?(?:#(?:[0-9a-fA-F]{3,8})\b|(?:rgb|hsl)a?\s*\()/

let installed = false

export function installInlineColorDevWarning(): void {
  if (!import.meta.env.DEV || typeof window === 'undefined' || installed) {
    return
  }
  installed = true

  const warned = new WeakSet<Element>()

  const check = (el: Element) => {
    if (!(el instanceof HTMLElement)) return
    const s = el.getAttribute('style')
    if (!s || warned.has(el)) return
    if (!INLINE_COLOR_RE.test(s)) return
    warned.add(el)
    console.warn(
      '[theme-guard] Inline CSS color on element (use design tokens / CSS variables instead):',
      el,
    )
  }

  const run = () => {
    document.querySelectorAll('[style]').forEach(check)
  }

  run()
  const mo = new MutationObserver(() => {
    run()
  })
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style'],
  })
}
