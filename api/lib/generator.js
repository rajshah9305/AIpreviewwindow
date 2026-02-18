import { callAI } from './ai-client.js'

const STYLE_THEMES = {
  minimal: {
    name: 'Minimalist',
    description: 'Clean lines, ample whitespace, and subtle design elements',
    colors: ['#78716c', '#a8a29e', '#292524'],
    spacing: 'tight',
    borders: 'thin',
  },
  bold: {
    name: 'Statement',
    description: 'High contrast, bold typography, and strong visual hierarchy',
    colors: ['#dc2626', '#f97316', '#292524'],
    spacing: 'generous',
    borders: 'thick',
  },
  elegant: {
    name: 'Sophisticated',
    description: 'Refined aesthetics with balanced proportions and subtle gradients',
    colors: ['#f59e0b', '#ef4444', '#57534e'],
    spacing: 'balanced',
    borders: 'subtle',
  },
  playful: {
    name: 'Expressive',
    description: 'Dynamic layouts with rounded corners and engaging interactions',
    colors: ['#fbbf24', '#f97316', '#292524'],
    spacing: 'varied',
    borders: 'rounded',
  },
  modern: {
    name: 'Contemporary',
    description: 'Sharp edges, spacious layouts, and modern design patterns',
    colors: ['#f97316', '#dc2626', '#1c1917'],
    spacing: 'spacious',
    borders: 'sharp',
  },
}

export async function generateUIComponents(instruction, settings) {
  const styles = Object.keys(STYLE_THEMES)
  const maxRetries = 2
  
  const generateVariation = async (style, index, retryCount = 0) => {
    const theme = STYLE_THEMES[style]
    
    const prompt = `Generate a single, complete, self-contained HTML component based on this instruction: "${instruction}"

Style: ${style}
Theme colors: ${theme.colors.join(', ')}
Spacing: ${theme.spacing}
Border style: ${theme.borders}

Requirements:
- Return ONLY the HTML code, no explanations or markdown
- Use Tailwind CSS classes (Tailwind CDN will be available)
- NO purple or blue colors - use orange (#f97316), red (#dc2626), yellow (#fbbf24), and neutral tones
- Make it visually distinct from other ${style} variations
- Create a complete, functional component with all necessary elements
- Include proper visual hierarchy and spacing
- Make it interactive where appropriate (buttons, forms, etc.)
- Use semantic HTML5 elements (form, button, input, article, section, etc.)
- Ensure WCAG 2.1 AA accessibility compliance:
  * Proper color contrast ratios (4.5:1 for normal text, 3:1 for large text)
  * ARIA labels and roles where appropriate
  * Keyboard navigation support (focus states, tab order)
  * Screen reader friendly markup
- Implement responsive design:
  * Mobile-first approach
  * Use responsive Tailwind classes (sm:, md:, lg:, xl:)
  * Ensure touch-friendly tap targets (min 44x44px)
  * Flexible layouts that adapt to different screen sizes
- The component should be centered and well-proportioned
- Add smooth hover states and transitions for interactive elements
- Include focus-visible states for keyboard navigation
- Use proper heading hierarchy (h1, h2, h3, etc.)

Style-specific guidance:
${style === 'minimal' ? '- Use clean lines, ample whitespace, subtle borders, muted colors' : ''}
${style === 'bold' ? '- Use strong colors, thick borders, large text, high contrast' : ''}
${style === 'elegant' ? '- Use refined typography, balanced spacing, subtle gradients, sophisticated feel' : ''}
${style === 'playful' ? '- Use rounded corners, varied spacing, fun interactions, cheerful colors' : ''}
${style === 'modern' ? '- Use sharp edges, contemporary layout, bold typography, clean design' : ''}

Return ONLY the HTML code without any markdown formatting, explanations, or code blocks.`

    try {
      const code = await callAI(prompt, settings)
      
      if (!code || code.trim().length < 50) {
        throw new Error('Generated code is too short or empty')
      }
      
      return {
        id: `${Date.now()}-${index}-${retryCount}`,
        name: theme.name,
        code: code.trim(),
        style,
      }
    } catch (error) {
      console.error(`Failed to generate ${style} variation (attempt ${retryCount + 1}/${maxRetries + 1}):`, error.message)
      
      if (retryCount < maxRetries) {
        console.log(`Retrying ${style} variation...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
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
  
  if (errors.length > 0) {
    console.error(`Failed to generate ${errors.length} variations:`, errors)
  }
  
  // Allow at least 3 successful variations (instead of requiring all 5)
  if (variations.length < 3) {
    const errorDetails = errors.map(e => `${e.style}: ${e.error}`).join('; ')
    throw new Error(`Only generated ${variations.length} out of 5 variations. Failed: ${errorDetails}`)
  }
  
  // Log warning if not all variations succeeded
  if (variations.length < 5) {
    console.warn(`Generated ${variations.length} out of 5 variations. Some variations failed but continuing.`)
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
  if (url.includes('cohere')) return 'Cohere'
  if (url.includes('groq')) return 'Groq'
  if (url.includes('together')) return 'Together AI'
  if (url.includes('replicate')) return 'Replicate'
  if (url.includes('huggingface')) return 'Hugging Face'
  if (url.includes('localhost') || url.includes('127.0.0.1')) return 'Local'
  
  return 'Custom'
}
