import React from 'react';

const statusLabels = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Completed',
};

export default function TaskItem({ task, onStatusChange, onEdit, onDelete, busyId }) {
  const busy = busyId === task._id;

  return (
    <article className="task-card">
      <div className="task-main">
        <div className="task-title-line">
          <h3>{task.title}</h3>
          <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
        </div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-details">
          <span className={`status-badge ${task.status}`}>{statusLabels[task.status] || task.status}</span>
          <span className="due-date">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</span>
        </div>
      </div>

      <div className="task-row-actions">
        <label className="status-select-label">
          <span className="visually-hidden">Change task status</span>
          <select value={task.status} disabled={busy} onChange={(event) => onStatusChange(task._id, event.target.value)}>
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Completed</option>
          </select>
        </label>
        <button className="icon-action edit-action" type="button" onClick={() => onEdit(task)} disabled={busy} title="Edit task" aria-label={`Edit ${task.title}`}>
          <span aria-hidden="true">✎</span><span>Edit</span>
        </button>
        <button className="icon-action delete-action" type="button" onClick={() => onDelete(task._id)} disabled={busy} title="Delete task" aria-label={`Delete ${task.title}`}>
          <span aria-hidden="true">⌫</span><span>{busy ? 'Wait...' : 'Delete'}</span>
        </button>
      </div>
    </article>
  );
}