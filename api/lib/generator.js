import { callAI } from './ai-client.js'

const STYLE_THEMES = {
  minimal: {
    name: 'Minimalist',
    description: 'Ultra-clean, high-end minimalism with bold black borders and precise proportions',
    traits: ['ample whitespace', 'bold black borders', 'refined typography'],
  },
  bold: {
    name: 'Statement',
    description: 'Professional, high-contrast design with clean, bold black elements',
    traits: ['bold black borders', 'impactful headings', 'strategic orange accents'],
  },
  elegant: {
    name: 'Sophisticated',
    description: 'Luxurious aesthetic with bold black borders and fluid spacing',
    traits: ['bold black borders', 'refined spacing', 'premium high-contrast feel'],
  },
  playful: {
    name: 'Expressive',
    description: 'Dynamic and engaging with organic shapes, bold black borders and interactions',
    traits: ['bold black borders', 'animated states', 'friendly high-contrast layout'],
  },
  modern: {
    name: 'Contemporary',
    description: 'Cutting-edge design with bold black borders following current high-end trends',
    traits: ['bold black borders', 'geometric clarity', 'modern high-contrast utility'],
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
1. Palette: Primary Orange (#f97316), Pure Black (#000000), Pure White (#ffffff). Use pure black (#000000) for all main borders.
2. Aesthetics: Use solid backgrounds and bold 2px black borders (border-2 border-black) for all main containers and boxes. Strictly NO gradients, glassmorphism, or backdrop blurs.
3. Typography: Use sans-serif (Inter) or display (Space Grotesk) fonts.
4. Shadows: Use high-end shadows (e.g., shadow-[0_10px_40px_rgba(0,0,0,0.06)]).
5. Corners: Use refined rounding (rounded-xl to rounded-2xl).
6. Hover: Add smooth transitions and sophisticated high-contrast hover effects.

Technical Constraints:
- Return ONLY the raw HTML code (no markdown, no explanations).
- CRITICAL: Strictly follow the user's NLP input only. Do not add any features, sections, or content that was not requested by the user. Accuracy to the provided description is the highest priority.
- Use Tailwind CSS classes exclusively.
- Lucide icons are available via <i data-lucide="icon-name"></i>.
- You can include simple vanilla JavaScript in <script> tags for basic interactivity (toggles, tabs, modals).
- Ensure WCAG 2.1 AA accessibility (proper contrast, ARIA, keyboard support).
- Mobile-first responsive design (sm:, md:, lg:).
- Center the component and ensure it's self-contained.
- Use semantic HTML5 elements.

Style Guidance for ${theme.name}:
- ${theme.traits.join(' and ')} should be the defining characteristics.
- Make it feel like a flagship product component, not a generic template.
- Focus on micro-details that elevate the quality (e.g., subtle borders, refined spacing).`

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
