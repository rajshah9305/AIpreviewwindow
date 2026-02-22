import { callAI } from './ai-client.js'

const STYLE_THEMES = {
  minimal: {
    name: 'Minimalist',
    description: 'Ultra-clean, high-end minimalism with precise proportions',
    traits: ['ample whitespace', 'hairline borders', 'refined typography'],
  },
  bold: {
    name: 'Statement',
    description: 'Professional, high-contrast design with clean, bold elements',
    traits: ['clean borders', 'bold headings', 'strategic orange accents'],
  },
  elegant: {
    name: 'Sophisticated',
    description: 'Luxurious aesthetic with subtle layers and fluid spacing',
    traits: ['soft shadows', 'refined spacing', 'premium feel'],
  },
  playful: {
    name: 'Expressive',
    description: 'Dynamic and engaging with organic shapes and interactions',
    traits: ['rounded corners', 'animated states', 'friendly layout'],
  },
  modern: {
    name: 'Contemporary',
    description: 'Cutting-edge design following current high-end trends',
    traits: ['glassmorphism', 'sharp grids', 'modern utility'],
  },
}

export async function generateUIComponents(instruction, settings) {
  const styles = Object.keys(STYLE_THEMES)
  const maxRetries = 1
  
  const generateVariation = async (style, index, retryCount = 0) => {
    const theme = STYLE_THEMES[style]
    
    const prompt = `Task: Generate a premium, production-ready HTML component.
Instruction: "${instruction}"
Design Style: ${theme.name} (${theme.description})
Key Traits: ${theme.traits.join(', ')}

Strict Design System:
1. Palette: Primary Orange (#f97316), Pure Black (#000000), Pure White (#ffffff). No other colors unless absolutely necessary for semantic meaning (e.g., red for errors).
2. Typography: Use sans-serif (Inter) for body text and display (Poppins) for headings. Employ tight tracking (tracking-tight or tracking-tighter) for large headings and wide tracking (tracking-widest) for small labels.
3. Shadows: Use high-end, multi-layered subtle shadows (e.g., shadow-[0_10px_40px_rgba(0,0,0,0.04),0_2px_4px_rgba(0,0,0,0.02)]).
4. Corners: Use refined, large rounding (rounded-2xl to rounded-[2rem]).
5. Hover: Add smooth, sophisticated transitions (duration-500, cubic-bezier) and micro-interactions (scale-105, shadow-xl).

Technical Constraints:
- Return ONLY the raw HTML code (no markdown blocks, no explanations).
- Use Tailwind CSS classes exclusively. Do not use custom CSS unless essential.
- Lucide icons are available via <i data-lucide="icon-name"></i>.
- You can include simple vanilla JavaScript in <script> tags for basic interactivity (toggles, tabs, modals). Always call `lucide.createIcons()` at the end of scripts.
- Ensure WCAG 2.1 AA accessibility (proper contrast, ARIA labels, keyboard focus states).
- Mobile-first responsive design using sm:, md:, lg: variants.
- Center the component using a container and ensure it is fully self-contained.
- Use semantic HTML5 elements (header, main, section, footer, nav, etc.).

Style Guidance for ${theme.name}:
- ${theme.traits.join(' and ')} must be the defining aesthetic.
- Design it as a flagship product feature for a premium tech brand.
- Focus on high-end micro-details: subtle 1px borders (border-neutral-100), refined inner padding, and perfect alignment.
- Use uppercase and italicized text sparingly for high-impact headers.
- Ensure every element feels intentional and part of a cohesive "premium" design language.`

    try {
      const code = await callAI(prompt, settings)
      
      return {
        id: `${Date.now()}-${index}-${retryCount}`,
        name: theme.name,
        code: code.trim(),
        style,
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        return generateVariation(style, index, retryCount + 1)
      }
      throw error
    }
  }
  
  const promises = styles.map((style, i) => generateVariation(style, i))
  const results = await Promise.allSettled(promises)
  
  const variations = []
  const errors = []
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      variations.push(result.value)
    } else if (result.status === 'rejected') {
      errors.push({
        style: styles[index],
        error: result.reason?.message || 'Unknown error'
      })
    }
  })
  
  if (variations.length < 3) {
    throw new Error(`Generation failed to produce enough quality variants. Details: ${errors.map(e => e.error).join(', ')}`)
  }
  
  return {
    instruction,
    variations,
    timestamp: Date.now(),
    modelName: settings.modelName,
    provider: extractProvider(settings.baseUrl),
  }
}

function extractProvider(baseUrl) {
  if (!baseUrl) return 'Unknown'
  const url = baseUrl.toLowerCase()
  if (url.includes('openai')) return 'OpenAI'
  if (url.includes('anthropic')) return 'Anthropic'
  if (url.includes('groq')) return 'Groq'
  if (url.includes('together')) return 'Together'
  if (url.includes('google')) return 'Google'
  return 'Custom'
}
