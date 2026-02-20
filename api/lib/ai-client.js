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
          content: 'You are a UI component generator. Generate clean, accessible HTML with inline Tailwind CSS classes. Use the color palette: primary orange (#f0760b, #f39333), accent red (#ef4444, #dc2626), and neutral tones. Never use purple or blue colors. Return only HTML code without markdown formatting.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    }),
  })

  const data = await handleResponse(response, 'OpenAI')
  const content = data.choices?.[0]?.message?.content

  if (!content || content.trim().length < 50) {
    throw new Error('Generated content too short or missing')
  }

  return cleanCode(content)
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
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are a UI component generator. Generate clean, accessible HTML with inline Tailwind CSS classes. Use the color palette: primary orange (#f0760b, #f39333), accent red (#ef4444, #dc2626), and neutral tones. Never use purple or blue colors. Return only HTML code without markdown formatting.\n\n${prompt}`,
        },
      ],
      temperature: 0.8,
    }),
  })

  const data = await handleResponse(response, 'Anthropic')
  const content = data.content?.[0]?.text

  if (!content || content.trim().length < 50) {
    throw new Error('Generated content too short or missing')
  }

  return cleanCode(content)
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

function cleanCode(code) {
  return code.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim()
}
