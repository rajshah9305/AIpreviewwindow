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
      variations.push({
        id: `${Date.now()}-${i}`,
        name: `${style.charAt(0).toUpperCase() + style.slice(1)} Variation`,
        code: generateFallbackComponent(instruction, style, theme),
        style,
      })
    }
  }
  
  return {
    instruction,
    variations,
    timestamp: Date.now(),
  }
}

function generateFallbackComponent(instruction, style, theme) {
  const [color1, color2, color3] = theme.colors
  
  const styleVariants = {
    minimal: `
      <div class="max-w-md mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 class="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h3>
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" placeholder="Your name" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" placeholder="you@example.com" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea placeholder="Your message" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"></textarea>
          </div>
          <button type="submit" class="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors">
            Send Message
          </button>
        </form>
      </div>
    `,
    bold: `
      <div class="max-w-md mx-auto p-8 bg-gradient-to-br from-red-50 to-orange-50 border-4 border-red-600 rounded-2xl shadow-xl">
        <h3 class="text-3xl font-bold text-red-600 mb-6">Get In Touch</h3>
        <form class="space-y-5">
          <div>
            <label class="block text-base font-bold text-gray-800 mb-2">Name</label>
            <input type="text" placeholder="Your name" class="w-full px-4 py-3 border-2 border-red-400 rounded-lg text-lg focus:outline-none focus:border-red-600" />
          </div>
          <div>
            <label class="block text-base font-bold text-gray-800 mb-2">Email</label>
            <input type="email" placeholder="you@example.com" class="w-full px-4 py-3 border-2 border-red-400 rounded-lg text-lg focus:outline-none focus:border-red-600" />
          </div>
          <div>
            <label class="block text-base font-bold text-gray-800 mb-2">Message</label>
            <textarea placeholder="Your message" rows="3" class="w-full px-4 py-3 border-2 border-red-400 rounded-lg text-lg focus:outline-none focus:border-red-600"></textarea>
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-6 rounded-lg text-lg font-bold hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105">
            Send Now!
          </button>
        </form>
      </div>
    `,
    elegant: `
      <div class="max-w-md mx-auto p-10 bg-white border border-orange-200 rounded-xl shadow-lg">
        <h3 class="text-2xl font-serif text-orange-600 mb-6 text-center">Contact Us</h3>
        <form class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input type="text" placeholder="Your name" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" placeholder="you@example.com" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea placeholder="What's on your mind?" rows="4" class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"></textarea>
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-md hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg">
            Submit
          </button>
        </form>
      </div>
    `,
    playful: `
      <div class="max-w-md mx-auto p-8 bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-orange-400 rounded-3xl shadow-2xl">
        <h3 class="text-3xl font-bold text-orange-600 mb-6 text-center">Let's Chat! 💬</h3>
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
            <input type="text" placeholder="What should we call you?" class="w-full px-4 py-3 border-2 border-yellow-400 rounded-2xl focus:outline-none focus:border-orange-500 bg-white" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input type="email" placeholder="your@email.com" class="w-full px-4 py-3 border-2 border-yellow-400 rounded-2xl focus:outline-none focus:border-orange-500 bg-white" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
            <textarea placeholder="Tell us everything!" rows="3" class="w-full px-4 py-3 border-2 border-yellow-400 rounded-2xl focus:outline-none focus:border-orange-500 bg-white"></textarea>
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-3 px-6 rounded-2xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg">
            Send Message 🚀
          </button>
        </form>
      </div>
    `,
    modern: `
      <div class="max-w-md mx-auto p-8 bg-gray-900 rounded-lg shadow-2xl">
        <h3 class="text-2xl font-bold text-white mb-6">Contact</h3>
        <form class="space-y-4">
          <div>
            <input type="text" placeholder="Name" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" />
          </div>
          <div>
            <input type="email" placeholder="Email" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" />
          </div>
          <div>
            <textarea placeholder="Message" rows="4" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"></textarea>
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 font-semibold hover:from-orange-700 hover:to-red-700 transition-all">
            SUBMIT
          </button>
        </form>
      </div>
    `
  }
  
  return styleVariants[style] || styleVariants.minimal
}
