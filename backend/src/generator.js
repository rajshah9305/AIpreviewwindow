import { callAI } from './ai-client.js'

const STYLE_THEMES = {
  minimal: {
    colors: ['#78716c', '#a8a29e', '#292524'],
    spacing: 'tight',
    borders: 'thin',
  },
  bold: {
    colors: ['#dc2626', '#f97316', '#292524'],
    spacing: 'generous',
    borders: 'thick',
  },
  elegant: {
    colors: ['#f59e0b', '#ef4444', '#57534e'],
    spacing: 'balanced',
    borders: 'subtle',
  },
  playful: {
    colors: ['#fbbf24', '#f97316', '#292524'],
    spacing: 'varied',
    borders: 'rounded',
  },
  modern: {
    colors: ['#f97316', '#dc2626', '#1c1917'],
    spacing: 'spacious',
    borders: 'sharp',
  },
}

export async function generateUIComponents(instruction, settings) {
  const styles = Object.keys(STYLE_THEMES)
  const variations = []
  const errors = []
  
  for (let i = 0; i < 5; i++) {
    const style = styles[i]
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
- Use semantic HTML (form, button, input, etc.)
- Ensure proper contrast and accessibility
- The component should be centered and well-proportioned
- Add hover states and transitions for interactive elements

Style-specific guidance:
${style === 'minimal' ? '- Use clean lines, ample whitespace, subtle borders, muted colors' : ''}
${style === 'bold' ? '- Use strong colors, thick borders, large text, high contrast' : ''}
${style === 'elegant' ? '- Use refined typography, balanced spacing, subtle gradients, sophisticated feel' : ''}
${style === 'playful' ? '- Use rounded corners, varied spacing, fun interactions, cheerful colors' : ''}
${style === 'modern' ? '- Use sharp edges, contemporary layout, bold typography, clean design' : ''}

Return ONLY the HTML code without any markdown formatting, explanations, or code blocks.`

    try {
      const code = await callAI(prompt, settings)
      
      variations.push({
        id: `${Date.now()}-${i}`,
        name: `${style.charAt(0).toUpperCase() + style.slice(1)} Variation`,
        code: code.trim(),
        style,
      })
    } catch (error) {
      console.error(`Failed to generate ${style} variation:`, error)
      errors.push({
        style,
        error: error.message
      })
      // Don't add fallback - let the error propagate
    }
  }
  
  // If all variations failed, throw an error
  if (variations.length === 0) {
    throw new Error(`Failed to generate any variations. Errors: ${errors.map(e => `${e.style}: ${e.error}`).join('; ')}`)
  }
  
  return {
    instruction,
    variations,
    timestamp: Date.now(),
  }
}
