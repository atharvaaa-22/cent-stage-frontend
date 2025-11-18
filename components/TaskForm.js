import { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${API}/tasks`, { title, description });
      setTitle(''); setDescription('');
      await queryClient.invalidateQueries(['tasks']);
    } catch (err) {
      console.error(err);
      alert('Could not create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={createTask} className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Add a new task</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 border rounded mb-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full p-2 border rounded mb-2 h-24"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
      >
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
