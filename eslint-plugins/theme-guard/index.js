/**
 * Theme guard: enforce design tokens instead of hardcoded hex and Tailwind palette utilities.
 */
const HEX_RE = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/

const PALETTE = new Set([
  'white',
  'black',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
])

const COLOR_PREFIXES = new Set([
  'bg',
  'text',
  'border',
  'ring',
  'fill',
  'stroke',
  'from',
  'to',
  'via',
  'divide',
  'outline',
  'shadow',
  'decoration',
  'accent',
  'caret',
  'placeholder',
])

/**
 * After the last variant (e.g. dark:hover:), returns the utility segment.
 * @param {string} token
 */
function baseUtility(token) {
  if (!token) return ''
  const parts = token.split(':')
  return parts[parts.length - 1] ?? ''
}

/**
 * Tailwind palette utilities (fixed palette names). Allows semantic/token classes like text-primary, bg-surface-page.
 * @param {string} segment
 */
function isForbiddenPaletteUtility(segment) {
  if (!segment || segment.startsWith('[')) {
    return false
  }
  const dash = segment.indexOf('-')
  if (dash <= 0) return false
  const prefix = segment.slice(0, dash)
  if (!COLOR_PREFIXES.has(prefix)) return false
  const rest = segment.slice(dash + 1)
  if (!rest) return false
  const colorName = rest.split('-')[0]
  if (!colorName) return false
  return PALETTE.has(colorName)
}

function checkClassString(value) {
  const tokens = value.split(/\s+/).filter(Boolean)
  for (const raw of tokens) {
    const seg = baseUtility(raw)
    if (isForbiddenPaletteUtility(seg)) {
      return { token: raw, segment: seg }
    }
  }
  return null
}

function checkString(value) {
  if (typeof value !== 'string') return null
  if (HEX_RE.test(value)) {
    return { kind: 'hex' }
  }
  const tailwindHit = checkClassString(value)
  if (tailwindHit) {
    return { kind: 'tailwind', ...tailwindHit }
  }
  return null
}

function reportHex(context, node) {
  context.report({
    node,
    messageId: 'hex',
  })
}

function reportTailwind(context, node, hit) {
  context.report({
    node,
    messageId: 'tailwind',
    data: { token: hit.token },
  })
}

/** @type {import('eslint').Rule.RuleModule} */
const noHardcodedHex = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded hex colors in source strings.',
    },
    schema: [],
    messages: {
      hex: 'All colors must use design tokens. No hardcoded values allowed. Replace hex with CSS variables (e.g. var(--…)) or token utilities.',
    },
  },
  create(context) {
    function visitString(value, node) {
      if (typeof value !== 'string') return
      if (HEX_RE.test(value)) {
        reportHex(context, node)
      }
    }
    return {
      Literal(node) {
        if (typeof node.value === 'string') visitString(node.value, node)
      },
      TemplateElement(node) {
        if (node.value && typeof node.value.cooked === 'string' && node.value.cooked) {
          visitString(node.value.cooked, node)
        }
      },
    }
  },
}

/** @type {import('eslint').Rule.RuleModule} */
const noTailwindPaletteColors = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow Tailwind default palette color utilities (bg-white, text-gray-500, etc.).',
    },
    schema: [],
    messages: {
      tailwind:
        'All colors must use design tokens. No hardcoded values allowed. Replace "{{token}}" with token-based utilities (e.g. text-primary, bg-surface-page) or arbitrary values with var(--…).',
    },
  },
  create(context) {
    function visitString(value, node) {
      if (typeof value !== 'string') return
      const hit = checkClassString(value)
      if (hit) {
        reportTailwind(context, node, hit)
      }
    }
    return {
      Literal(node) {
        if (typeof node.value === 'string') visitString(node.value, node)
      },
      TemplateElement(node) {
        if (node.value && typeof node.value.cooked === 'string' && node.value.cooked) {
          visitString(node.value.cooked, node)
        }
      },
    }
  },
}

export default {
  meta: { name: 'eslint-plugin-theme-guard', version: '1.0.0' },
  rules: {
    'no-hardcoded-hex': noHardcodedHex,
    'no-tailwind-palette-colors': noTailwindPaletteColors,
  },
}
