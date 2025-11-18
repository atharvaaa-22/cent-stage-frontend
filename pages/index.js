import useSWR from 'swr'
import { useState } from 'react'
import TaskItem from '../components/TaskItem'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
const fetcher = (url) => fetch(url).then(res => res.json())

export default function Home() {
  const { data: tasks = [], mutate, error } = useSWR(API + '/tasks', fetcher, { refreshInterval: 0 })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  async function addTask(e) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    const res = await fetch(API + '/tasks', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ title, description })
    })
    if (res.ok) {
      setTitle(''); setDescription('')
      mutate()
    } else {
      console.error('Failed to create task', await res.text())
    }
    setLoading(false)
  }

  async function toggleTask(task) {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    // optimistic UI: update locally then call backend
    const optimistic = tasks.map(t => t.id === task.id ? {...t, status: newStatus} : t)
    mutate(optimistic, false)
    const res = await fetch(`${API}/tasks/${task.id}`, {
      method: 'PATCH',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ status: newStatus })
    })
    if (!res.ok) mutate() // refetch on failure
  }

  async function deleteTask(task) {
    if (!confirm('Delete this task?')) return
    const optimistic = tasks.filter(t => t.id !== task.id)
    mutate(optimistic, false)
    const res = await fetch(`${API}/tasks/${task.id}`, { method: 'DELETE' })
    if (!res.ok) mutate() // refetch on failure
  }

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Cent Stage — Tasks</h1>
        <p className="text-sm text-gray-600">Simple task manager frontend (Next.js + Tailwind)</p>
      </header>

      <section className="mb-6 bg-white p-4 rounded shadow-sm">
        <form onSubmit={addTask} className="grid gap-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" className="p-2 border rounded" />
          <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description (optional)" className="p-2 border rounded" />
          <div className="flex items-center gap-3">
            <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
              {loading ? 'Adding...' : 'Add Task'}
            </button>
            <span className="text-sm text-gray-500">API: <code className="bg-gray-100 px-2 py-0.5 rounded">{API}</code></span>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Tasks</h2>
        {error && <div className="p-3 bg-red-50 text-red-700 rounded mb-3">Failed to load tasks</div>}
        <ul className="space-y-3">
          {tasks.length === 0 && <li className="text-sm text-gray-500">No tasks yet.</li>}
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
          ))}
        </ul>
      </section>
    </main>
  )
}
