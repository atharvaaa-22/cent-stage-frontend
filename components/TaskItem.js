export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="flex items-start justify-between gap-4 p-3 bg-white rounded shadow-sm">
      <div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => onToggle(task)}
            className="h-4 w-4"
          />
          <h3 className={task.status === 'completed' ? 'line-through text-gray-400' : 'font-medium'}>{task.title}</h3>
        </div>
        {task.description && <p className="mt-1 text-sm text-gray-600">{task.description}</p>}
        <p className="mt-2 text-xs text-gray-400">Created: {new Date(task.createdAt).toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onDelete(task)} className="text-sm px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
      </div>
    </li>
  )
}
