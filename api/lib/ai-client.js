const SYSTEM_PROMPT =
  'You are a world-class UI component generator. Generate clean, accessible HTML with inline Tailwind CSS classes. ' +
  'Design system: primary orange (#f97316), black text, white backgrounds. No purple or blue. ' +
  'Return only raw HTML — no markdown, no explanations.'

export async function callAI(prompt, settings) {
  const { modelName, apiKey, baseUrl } = settings
  if (!modelName?.trim()) throw new Error('Model name is required')
  if (!apiKey?.trim())    throw new Error('API key is required')
  if (!baseUrl?.trim())   throw new Error('Base URL is required')

  const base = baseUrl.trim().replace(/\/$/, '')
  return base.includes('anthropic.com')
    ? callAnthropic(prompt, modelName, apiKey, base)
    : callOpenAI(prompt, modelName, apiKey, base)
}

async function callOpenAI(prompt, model, apiKey, baseUrl) {
  const endpoint = baseUrl.includes('/chat/completions') ? baseUrl
    : baseUrl.includes('/v1') ? `${baseUrl}/chat/completions`
    : `${baseUrl}/v1/chat/completions`

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    }),
  })

  const data = await parseResponse(res, 'OpenAI')
  return extractCode(data.choices?.[0]?.message?.content)
}

async function callAnthropic(prompt, model, apiKey, baseUrl) {
  const res = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 3000,
      temperature: 0.7,
      messages: [{ role: 'user', content: `${SYSTEM_PROMPT}\n\n${prompt}` }],
    }),
  })

  const data = await parseResponse(res, 'Anthropic')
  return extractCode(data.content?.[0]?.text)
}

async function parseResponse(res, provider) {
  if (!res.ok) {
    const text = await res.text()
    let message
    try { message = JSON.parse(text)?.error?.message ?? `${provider} error ${res.status}` }
    catch { message = `${provider} error ${res.status}: ${res.statusText}` }
    throw new Error(message)
  }
  return res.json()
}

function extractCode(content) {
  if (!content || content.trim().length < 50)
    throw new Error('Generated content is too short. Try a more detailed prompt.')

  const htmlBlock = content.match(/```html\s*([\s\S]*?)\s*```/i)
  if (htmlBlock) return htmlBlock[1].trim()

  const codeBlock = content.match(/```\s*([\s\S]*?)\s*```/)
  if (codeBlock) return codeBlock[1].trim()

  const first = content.indexOf('<')
  const last  = content.lastIndexOf('>')
  if (first !== -1 && last > first) return content.slice(first, last + 1).trim()

  return content.trim()
}
