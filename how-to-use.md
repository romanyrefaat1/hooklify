// 1) Fetch token once on load or on expiry
async function getToken() {
  const res = await fetch('https://hooklify.vercel.app/api/embed/auth/get-jwt', {
    method: 'POST',
    headers: {
      'x-site-api-key': SITE_API_KEY,
      'x-widget-api-key': WIDGET_API_KEY,
    }
  })
  const { token } = await res.json()
  localStorage.setItem('widget_jwt', token)
  return token
}

// 2) Log event
async function logEvent(type, data) {
  let token = localStorage.getItem('widget_jwt')
  if (!token) token = await getToken()

  const res = await fetch('https://hooklify.vercel.app/api/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ event_type: type, event_data: data })
  })
  if (res.status === 401) {
    // token expired or invalid → get a new one and retry
    token = await getToken()
    return logEvent(type, data)
  }
  return res.ok
}
