export async function callAI(prompt, settings) {
  const { modelName, apiKey, baseUrl } = settings
  
  if (!modelName?.trim()) throw new Error('Model name is required')
  if (!apiKey?.trim()) throw new Error('API key is required')
  if (!baseUrl?.trim()) throw new Error('Base URL is required')
  
  const normalizedBaseUrl = baseUrl.trim().replace(/\/$/, '')
  const isAnthropic = normalizedBaseUrl.includes('anthropic.com')
  
  return isAnthropic
    ? callAnthropic(prompt, modelName, apiKey, normalizedBaseUrl)
    : callOpenAI(prompt, modelName, apiKey, normalizedBaseUrl)
}

async function callOpenAI(prompt, model, apiKey, baseUrl) {
  const endpoint = baseUrl.includes('/chat/completions') ? baseUrl :
                   baseUrl.includes('/v1') ? `${baseUrl}/chat/completions` :
                   `${baseUrl}/v1/chat/completions`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a world-class UI component generator. Generate clean, accessible HTML with inline Tailwind CSS classes. Adhere to a premium design system: primary orange (#f97316), black text, and white backgrounds. Never use purple or blue. Return only raw HTML. Do not include markdown code blocks or any explanation.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    }),
  })

  const data = await handleResponse(response, 'OpenAI')
  const content = data.choices?.[0]?.message?.content
  return validateAndClean(content)
}

async function callAnthropic(prompt, model, apiKey, baseUrl) {
  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: `You are a world-class UI component generator. Generate clean, accessible HTML with inline Tailwind CSS classes. Adhere to a premium design system: primary orange (#f97316), black text, and white backgrounds. Never use purple or blue. Return only raw HTML without markdown code blocks or explanations.\n\n${prompt}`,
        },
      ],
      temperature: 0.7,
    }),
  })

  const data = await handleResponse(response, 'Anthropic')
  const content = data.content?.[0]?.text
  return validateAndClean(content)
}

async function handleResponse(response, provider) {
  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage
    try {
      const errorJson = JSON.parse(errorText)
      errorMessage = errorJson.error?.message || errorJson.message || `${provider} API error: ${response.status}`
    } catch {
      errorMessage = `${provider} API error: ${response.status} ${response.statusText}`
    }
    throw new Error(errorMessage)
  }
  return response.json()
}

function validateAndClean(content) {
  if (!content || content.trim().length < 50) {
    throw new Error('Generated content is too short or missing. Please try a more detailed prompt.')
  }

  // Extract content between ```html and ``` if present
  const htmlMatch = content.match(/```html\s*([\s\S]*?)\s*```/i)
  if (htmlMatch) return htmlMatch[1].trim()

  // Extract content between ``` and ``` if present
  const codeMatch = content.match(/```\s*([\s\S]*?)\s*```/)
  if (codeMatch) return codeMatch[1].trim()

  // If no code blocks, try to find the first < and last >
  const firstTag = content.indexOf('<')
  const lastTag = content.lastIndexOf('>')
  if (firstTag !== -1 && lastTag !== -1 && lastTag > firstTag) {
    return content.substring(firstTag, lastTag + 1).trim()
  }

  return content.trim()
}
