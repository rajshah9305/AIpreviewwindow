export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { baseUrl, apiKey } = req.body

  if (!baseUrl) {
    return res.status(400).json({ message: 'Base URL is required' })
  }

  try {
    const normalizedUrl = baseUrl.trim().replace(/\/$/, '')

    // Attempt to reach the provider
    // We try a simple request. Since we want to be provider agnostic,
    // we just try to fetch the base URL or a common sub-path.
    // For OpenAI-compatible APIs, /v1/models or just / is common.

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(normalizedUrl, {
      method: 'GET',
      signal: controller.signal
    }).catch(err => {
        if (err.name === 'AbortError') throw new Error('Connection timeout')
        throw err
    })

    clearTimeout(timeoutId)

    // Even if it's a 401 or 404, if we got a response from the server, the endpoint is reachable
    if (response.status >= 200 && response.status < 500) {
      res.status(200).json({
        status: 'ok',
        reachable: true,
        statusCode: response.status
      })
    } else {
      res.status(response.status).json({
        status: 'error',
        reachable: false,
        statusCode: response.status,
        message: `Server returned ${response.status}`
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      reachable: false,
      message: error.message || 'Could not reach the server'
    })
  }
}
