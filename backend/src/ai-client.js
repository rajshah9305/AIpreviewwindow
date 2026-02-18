export async function callAI(prompt, settings) {
  const { modelName, apiKey, baseUrl } = settings
  
  // Detect provider based on base URL
  const isAnthropic = baseUrl.includes('anthropic.com')
  const isOpenAI = baseUrl.includes('openai.com') || !isAnthropic
  
  if (isAnthropic) {
    return callAnthropic(prompt, modelName, apiKey, baseUrl)
  } else {
    return callOpenAI(prompt, modelName, apiKey, baseUrl)
  }
}

async function callOpenAI(prompt, model, apiKey, baseUrl) {
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
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
      throw new Error(error.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API')
    }
    
    return cleanCode(data.choices[0].message.content)
  } catch (error) {
    if (error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to OpenAI API')
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
  // Remove markdown code blocks if present
  code = code.replace(/```html\n?/g, '').replace(/```\n?/g, '')
  
  // Remove any leading/trailing whitespace
  code = code.trim()
  
  return code
}
