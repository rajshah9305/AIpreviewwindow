import { callAI } from './ai-client.js'

const STYLES = {
  minimal:  { name: 'Minimalist',    traits: 'ample whitespace, bold black borders, refined typography' },
  bold:     { name: 'Statement',     traits: 'bold black borders, impactful headings, strategic orange accents' },
  elegant:  { name: 'Sophisticated', traits: 'bold black borders, refined spacing, premium high-contrast feel' },
  playful:  { name: 'Expressive',    traits: 'bold black borders, animated states, friendly high-contrast layout' },
  modern:   { name: 'Contemporary',  traits: 'bold black borders, geometric clarity, modern high-contrast utility' },
}

function buildPrompt(instruction, style) {
  const { name, traits } = STYLES[style]
  return `Task: Generate a premium, production-ready HTML component.
Instruction: "${instruction}"
Style: ${name} — ${traits}

Design rules:
- Palette: orange #f97316, black #000000, white #ffffff only
- All main containers: solid backgrounds + border-2 border-black
- No gradients, glassmorphism, or backdrop-blur
- Shadows: shadow-[0_10px_40px_rgba(0,0,0,0.06)]
- Corners: rounded-xl to rounded-2xl
- Smooth hover transitions
- Tailwind CSS classes only
- Lucide icons via <i data-lucide="icon-name"></i>
- Vanilla JS in <script> tags for interactivity
- WCAG 2.1 AA accessibility
- Mobile-first responsive (sm: md: lg:)
- Semantic HTML5, self-contained, centered
- Return ONLY raw HTML — no markdown, no explanations
- Match the instruction exactly — do not add unrequested features`
}

async function generateVariation(instruction, style, index, retries = 1) {
  try {
    const code = await callAI(buildPrompt(instruction, style), arguments[3])
    return { id: `${Date.now()}-${index}`, name: STYLES[style].name, code: code.trim(), style }
  } catch (err) {
    if (retries > 0) return generateVariation(instruction, style, index, retries - 1, arguments[3])
    throw err
  }
}

export async function generateUIComponents(instruction, settings) {
  const styles  = Object.keys(STYLES)
  const results = await Promise.allSettled(
    styles.map((style, i) => {
      const prompt = buildPrompt(instruction, style)
      return callAI(prompt, settings).then(code => ({
        id: `${Date.now()}-${i}`,
        name: STYLES[style].name,
        code: code.trim(),
        style,
      }))
    })
  )

  const variations = []
  const errors     = []

  results.forEach((r, i) => {
    if (r.status === 'fulfilled') variations.push(r.value)
    else errors.push(`${styles[i]}: ${r.reason?.message ?? 'unknown error'}`)
  })

  if (variations.length < 3)
    throw new Error(`Too few variations generated. ${errors.join('; ')}`)

  return {
    instruction,
    variations,
    timestamp: Date.now(),
    modelName: settings.modelName,
    provider: extractProvider(settings.baseUrl),
  }
}

function extractProvider(baseUrl = '') {
  const url = baseUrl.toLowerCase()
  if (url.includes('openai'))    return 'OpenAI'
  if (url.includes('anthropic')) return 'Anthropic'
  if (url.includes('groq'))      return 'Groq'
  if (url.includes('together'))  return 'Together'
  return 'Custom'
}
