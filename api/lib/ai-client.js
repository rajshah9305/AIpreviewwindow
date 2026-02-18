export async function callAI(prompt, settings) {
  const { modelName, apiKey, baseUrl } = settings
  
  if (!modelName || !apiKey || !baseUrl) {
    throw new Error('Missing required AI settings: modelName, apiKey, or baseUrl')
  }
  
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '')
  
  console.log(`Calling AI with model: ${modelName}, baseUrl: ${normalizedBaseUrl}`)
  
  const isAnthropic = normalizedBaseUrl.includes('anthropic.com')
  const isOpenAI = normalizedBaseUrl.includes('openai.com') || !isAnthropic
  
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
            content: 'You are a UI component generator. Generate clean, accessible HTML with inline Tailwind CSS classes. Never use purple or blue colors. Return only HTML code without markdown formatting.',
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
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || `API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from API')
    }
    
    return cleanCode(data.choices[0].message.content)
  } catch (error) {
    if (error.message.includes('fetch')) {
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
            content: `You are a UI component generator. Generate clean, accessible HTML with inline Tailwind CSS classes. Never use purple or blue colors. Return only HTML code without markdown formatting.\n\n${prompt}`,
          },
        ],
        temperature: 0.8,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || `Anthropic API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.content?.[0]?.text) {
      throw new Error('Invalid response from Anthropic API')
    }
    
    return cleanCode(data.content[0].text)
  } catch (error) {
    if (error.message.includes('fetch')) {
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
