import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchTasks() {
  const res = await axios.get(`${API}/tasks`);
  return res.data;
}

export default function TaskList() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery(['tasks'], fetchTasks, { staleTime: 5000 });

  const toggleMutation = useMutation(
    async (task) => {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      const res = await axios.put(`${API}/tasks/${task.id}`, { status: newStatus });
      return res.data;
    },
    { onSuccess: () => queryClient.invalidateQueries(['tasks']) }
  );

  const deleteMutation = useMutation(
    async (id) => await axios.delete(`${API}/tasks/${id}`),
    { onSuccess: () => queryClient.invalidateQueries(['tasks']) }
  );

  if (isLoading) return <div className="bg-white p-4 rounded shadow">Loading tasks...</div>;
  if (isError) return <div className="bg-white p-4 rounded shadow">Error loading tasks</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Tasks</h2>
      {data.length === 0 && <div className="text-gray-500">No tasks yet</div>}
      <ul className="space-y-3">
        {data.map((task) => (
          <li key={task.id} className="p-3 border rounded flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleMutation.mutate(task)}
                  aria-label="toggle-status"
                  className={`px-2 py-1 rounded ${task.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}`}
                >
                  {task.status === 'completed' ? 'Completed' : 'Pending'}
                </button>
                <h3 className="font-medium">{task.title}</h3>
              </div>
              {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
              <div className="text-xs text-gray-400 mt-1">{new Date(task.createdAt).toLocaleString()}</div>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <button onClick={() => deleteMutation.mutate(task.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
