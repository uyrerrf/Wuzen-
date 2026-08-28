import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { api } from '../utils/api'
import { Users, Plus, Trash2, Shield } from 'lucide-react'

export default function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'operator' })

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    const data = await api.get('/users')
    if (data) setUsers(data)
  }

  const handleAdd = async () => {
    await api.post('/auth/register', form)
    setShowForm(false)
    loadUsers()
  }

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`)
    loadUsers()
  }

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email', render: (row) => <span className="text-xs">{row.email}</span> },
    { key: 'role', label: 'Role', render: (row) => (
      <span className={`text-xs px-2 py-0.5 rounded ${row.role === 'admin' ? 'bg-wuzen-danger/10 text-wuzen-danger' : 'bg-wuzen-primary/10 text-wuzen-primary'}`}>
        {row.role?.toUpperCase()}
      </span>
    )},
    { key: 'is_active', label: 'Status', render: (row) => (
      <span className={`text-xs ${row.is_active ? 'text-wuzen-success' : 'text-wuzen-danger'}`}>{row.is_active ? 'Active' : 'Inactive'}</span>
    )},
    { key: 'last_login', label: 'Last Login', render: (row) => (
      <span className="text-xs font-mono">{row.last_login ? new Date(row.last_login).toLocaleString() : 'Never'}</span>
    )},
    { key: 'actions', label: '', render: (row) => (
      <button onClick={() => handleDelete(row.id)} className="p-1 rounded hover:bg-wuzen-danger/10 text-wuzen-danger">
        <Trash2 className="w-4 h-4" />
      </button>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="User Management" icon={Users} deviceSelector={false}>
        <button onClick={() => setShowForm(!showForm)} className="wuzen-btn-primary">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </PageHeader>

      {showForm && (
        <div className="wuzen-panel p-4 mb-4 grid grid-cols-4 gap-3">
          <input className="wuzen-input" placeholder="Username" value={form.username} onChange={e => setForm(p => ({...p, username: e.target.value}))} />
          <input className="wuzen-input" placeholder="Email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
          <input className="wuzen-input" type="password" placeholder="Password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} />
          <div className="flex gap-2">
            <select className="wuzen-input flex-1" value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))}>
              <option value="operator">Operator</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={handleAdd} className="wuzen-btn-success text-xs">Add</button>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={users} keyField="id" searchable />
    </div>
  )
}
