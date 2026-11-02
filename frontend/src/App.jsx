import React, { useCallback, useEffect, useState } from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  getErrorMessage,
} from './services/taskService.js';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { sortBy, order };
      if (status !== 'all') params.status = status;
      const response = await fetchTasks(params);
      setTasks(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [status, sortBy, order]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  function openAddForm() {
    setEditingTask(null);
    setError('');
    setFormOpen(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setError('');
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setEditingTask(null);
  }

  async function handleSave(formData) {
    setSaving(true);
    setError('');
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
      } else {
        await createTask(formData);
      }
      setFormOpen(false);
      setEditingTask(null);
      await loadTasks();
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(id, newStatus) {
    setBusyId(id);
    setError('');
    try {
      await updateTask(id, { status: newStatus });
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setBusyId(id);
    setError('');
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  const counts = {
    all: tasks.length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    in_progress: tasks.filter((task) => task.status === 'in_progress').length,
    done: tasks.filter((task) => task.status === 'done').length,
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">MY WORKSPACE</p>
          <h1>Personal Task Manager</h1>
          <p className="subtitle">Organize your work, stay focused, and get things done.</p>
        </div>
        <button className="header-add-button" onClick={openAddForm}>
          <span aria-hidden="true">＋</span> Add Task
        </button>
      </header>

      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button onClick={() => setError('')} aria-label="Dismiss error">×</button>
        </div>
      )}

      <section className="dashboard-layout">
        <section className="tasks-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">OVERVIEW</p>
              <h2>My Tasks <span className="task-count">{tasks.length}</span></h2>
              <p className="muted">All your tasks in one place</p>
            </div>
            <button className="refresh-button" onClick={loadTasks} disabled={loading}>
              {loading ? 'Loading...' : '↻ Refresh'}
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-card"><span className="stat-dot todo-dot" /><div><strong>{counts.todo}</strong><span>To do</span></div></div>
            <div className="stat-card"><span className="stat-dot progress-dot" /><div><strong>{counts.in_progress}</strong><span>In progress</span></div></div>
            <div className="stat-card"><span className="stat-dot done-dot" /><div><strong>{counts.done}</strong><span>Completed</span></div></div>
          </div>

          <div className="list-toolbar">
            <div>
              <h3>Task list</h3>
              <p className="muted">View and manage your tasks</p>
            </div>
            <div className="filters">
              <label>
                <span>Filter</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="todo">To do</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <label>
                <span>Sort by</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="createdAt">Created date</option>
                  <option value="dueDate">Due date</option>
                  <option value="priority">Priority</option>
                </select>
              </label>
              <label>
                <span>Order</span>
                <select value={order} onChange={(event) => setOrder(event.target.value)}>
                  <option value="desc">Newest first</option>
                  <option value="asc">Oldest first</option>
                </select>
              </label>
            </div>
          </div>

          <TaskList
            tasks={tasks}
            loading={loading}
            onStatusChange={handleStatusChange}
            onEdit={openEditForm}
            onDelete={handleDelete}
            busyId={busyId}
          />
        </section>

        <aside className="side-panel">
          <div className="side-panel-heading">
            <div>
              <p className="section-kicker">QUICK ACTION</p>
              <h2>Task Actions</h2>
            </div>
            <span className="side-icon" aria-hidden="true">✦</span>
          </div>

          <button className={`add-task-tab ${formOpen && !editingTask ? 'active' : ''}`} onClick={openAddForm}>
            <span className="plus-icon">＋</span>
            <span><strong>Add New Task</strong><small>Create a task for your list</small></span>
            <span className="tab-arrow">›</span>
          </button>

          {formOpen ? (
            <TaskForm
              key={editingTask?._id || 'new-task'}
              initialTask={editingTask}
              onSave={handleSave}
              onCancel={closeForm}
              busy={saving}
            />
          ) : (
            <div className="form-placeholder">
              <div className="placeholder-icon">＋</div>
              <h3>Ready to get things done?</h3>
              <p>Click <strong>Add New Task</strong> to create a task. You can also edit any task directly from the task list.</p>
              <button className="outline-add-button" onClick={openAddForm}>＋ Create a task</button>
            </div>
          )}
        </aside>
      </section>

      <footer></footer>
    </main>
  );
}