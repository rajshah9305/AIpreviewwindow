export async function callAI(prompt, settings) {
  const { modelName, apiKey, baseUrl } = settings
  
  if (!modelName || !apiKey || !baseUrl) {
    throw new Error('Missing required AI settings: modelName, apiKey, or baseUrl')
  }
  
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '')
  
  console.log(`Calling AI with model: ${modelName}, baseUrl: ${normalizedBaseUrl}`)
  
  const isAnthropic = normalizedBaseUrl.includes('anthropic.com')
  
  if (isAnthropic) {
    return callAnthropic(prompt, modelName, apiKey, normalizedBaseUrl)
  } else {
    return callOpenAI(prompt, modelName, apiKey, normalizedBaseUrl)
  }
}

async function callOpenAI(prompt, model, apiKey, baseUrl) {
  try {
    let endpoint
    
    if (baseUrl.includes('/chat/completions')) {
      endpoint = baseUrl
    } else if (baseUrl.includes('/v1')) {
      endpoint = `${baseUrl}/chat/completions`
    } else {
      endpoint = `${baseUrl}/v1/chat/completions`
    }
    
    console.log(`OpenAI-compatible endpoint: ${endpoint}`)
    
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
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.message || errorJson.message || `API error: ${response.status}`
      } catch {
        errorMessage = `API error: ${response.status} ${response.statusText}`
      }
      console.error('API Error Response:', errorText)
      throw new Error(errorMessage)
    }
    
    const data = await response.json()
    console.log('API Response structure:', Object.keys(data))
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid API response structure:', JSON.stringify(data, null, 2))
      throw new Error(`Invalid response from API - missing content. Response keys: ${Object.keys(data).join(', ')}`)
    }
    
    const content = data.choices[0].message.content
    if (!content || content.trim().length < 50) {
      throw new Error(`Generated content too short: ${content?.length || 0} characters`)
    }
    
    return cleanCode(content)
  } catch (error) {
    console.error('callOpenAI error:', error)
    if (error.message.includes('fetch') || error.name === 'TypeError') {
      throw new Error('Network error: Unable to connect to API')
    }
    throw error
  }
}

async function callAnthropic(prompt, model, apiKey, baseUrl) {
  try {
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
    
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.message || errorJson.message || `Anthropic API error: ${response.status}`
      } catch {
        errorMessage = `Anthropic API error: ${response.status} ${response.statusText}`
      }
      console.error('Anthropic Error Response:', errorText)
      throw new Error(errorMessage)
    }
    
    const data = await response.json()
    console.log('Anthropic Response structure:', Object.keys(data))
    
    if (!data.content?.[0]?.text) {
      console.error('Invalid Anthropic response structure:', JSON.stringify(data, null, 2))
      throw new Error(`Invalid response from Anthropic API - missing content. Response keys: ${Object.keys(data).join(', ')}`)
    }
    
    const text = data.content[0].text
    if (!text || text.trim().length < 50) {
      throw new Error(`Generated content too short: ${text?.length || 0} characters`)
    }
    
    return cleanCode(text)
  } catch (error) {
    console.error('callAnthropic error:', error)
    if (error.message.includes('fetch') || error.name === 'TypeError') {
      throw new Error('Network error: Unable to connect to Anthropic API')
    }
    throw error
  }
}

function cleanCode(code) {
  code = code.replace(/```html\n?/g, '').replace(/```\n?/g, '')
  code = code.trim()
  return code
}
