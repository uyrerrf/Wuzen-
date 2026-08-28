import { create } from 'zustand'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws'

export const useStore = create((set, get) => ({
  // Auth
  token: localStorage.getItem('wuzen_token') || null,
  user: JSON.parse(localStorage.getItem('wuzen_user') || 'null'),
  setAuth: (token, user) => {
    localStorage.setItem('wuzen_token', token)
    localStorage.setItem('wuzen_user', JSON.stringify(user))
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem('wuzen_token')
    localStorage.removeItem('wuzen_user')
    set({ token: null, user: null, ws: null })
  },

  // WebSocket
  ws: null,
  wsConnected: false,
  wsMessages: [],
  connectWS: () => {
    const { token } = get()
    if (!token) return
    const ws = new WebSocket(`${WS_BASE}?operator=true&token=${token}`)
    ws.onopen = () => set({ wsConnected: true })
    ws.onclose = () => set({ wsConnected: false })
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      set(state => ({ wsMessages: [msg, ...state.wsMessages].slice(0, 500) }))
    }
    set({ ws })
  },
  sendWS: (msg) => {
    const { ws } = get()
    if (ws && ws.readyState === 1) ws.send(JSON.stringify(msg))
  },

  // Devices
  devices: [],
  selectedDevice: null,
  setDevices: (devices) => set({ devices }),
  setSelectedDevice: (device) => set({ selectedDevice: device }),

  // Stats
  stats: {},
  setStats: (stats) => set({ stats }),

  // UI
  sidebarOpen: true,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Notifications
  toasts: [],
  addToast: (toast) => set(state => ({ 
    toasts: [...state.toasts, { id: Date.now(), ...toast }].slice(-5) 
  })),
  removeToast: (id) => set(state => ({ 
    toasts: state.toasts.filter(t => t.id !== id) 
  })),

  // API helper
  api: async (endpoint, options = {}) => {
    const { token } = get()
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    })
    if (res.status === 401) {
      get().logout()
      window.location.href = '/login'
      return null
    }
    return res.json()
  }
}))
