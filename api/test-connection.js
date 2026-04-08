export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')   return res.status(405).json({ message: 'Method not allowed' })

  const { baseUrl } = req.body ?? {}
  if (!baseUrl) return res.status(400).json({ message: 'baseUrl is required' })

  const url = baseUrl.trim().replace(/\/$/, '')
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(url, { method: 'GET', signal: controller.signal })
    clearTimeout(timeout)

    if (response.status >= 200 && response.status < 500)
      return res.status(200).json({ reachable: true, statusCode: response.status })

    return res.status(response.status).json({ reachable: false, statusCode: response.status, message: `Server returned ${response.status}` })
  } catch (err) {
    clearTimeout(timeout)
    return res.status(500).json({ reachable: false, message: err.name === 'AbortError' ? 'Connection timed out' : (err.message ?? 'Could not reach server') })
  }
}
