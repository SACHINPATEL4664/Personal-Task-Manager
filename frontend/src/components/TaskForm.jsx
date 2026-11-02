import React, { useState } from 'react';

const emptyForm = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: '',
};

function toDateInputValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function TaskForm({ initialTask, onSave, onCancel, busy }) {
  const [form, setForm] = useState(() => initialTask
    ? {
        title: initialTask.title || '',
        description: initialTask.description || '',
        priority: initialTask.priority || 'medium',
        status: initialTask.status || 'todo',
        dueDate: toDateInputValue(initialTask.dueDate),
      }
    : emptyForm);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError('Task title is required.');
      return;
    }
    setError('');
    await onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate || null,
    });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-title-row">
        <div>
          <p className="section-kicker">{initialTask ? 'UPDATE DETAILS' : 'NEW ENTRY'}</p>
          <h3>{initialTask ? 'Edit Task' : 'Create a Task'}</h3>
        </div>
        <span className="form-title-icon">{initialTask ? '✎' : '＋'}</span>
      </div>

      <label htmlFor="task-title">Task title <span className="required">*</span></label>
      <input
        id="task-title"
        name="title"
        value={form.title}
        onChange={handleChange}
        maxLength={120}
        placeholder="e.g. Complete MERN assignment"
        autoFocus
      />

      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        name="description"
        value={form.description}
        onChange={handleChange}
        maxLength={1000}
        rows={4}
        placeholder="Add a few details about this task..."
      />

      <div className="form-field-row">
        <div>
          <label htmlFor="task-priority">Priority</label>
          <select id="task-priority" name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="task-due-date">Due date</label>
          <input id="task-due-date" type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
        </div>
      </div>

      {initialTask && (
        <>
          <label htmlFor="task-status">Status</label>
          <select id="task-status" name="status" value={form.status} onChange={handleChange}>
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </>
      )}

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-buttons">
        <button className="save-button" type="submit" disabled={busy}>
          {busy ? 'Saving...' : initialTask ? 'Save Changes' : 'Create Task'}
        </button>
        <button className="cancel-button" type="button" onClick={onCancel} disabled={busy}>Cancel</button>
      </div>
    </form>
  );
}