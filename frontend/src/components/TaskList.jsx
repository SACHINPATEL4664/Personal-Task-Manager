import React from 'react';
import TaskItem from './TaskItem';
export default function TaskList({ tasks, onStatusChange, onEdit, onDelete, busyId, loading }) {
  if (loading) {
    return <div className="list-message"><span className="loading-spinner" /> <p>Loading your tasks...</p></div>;
  }

  if (!tasks.length) {
    return (
      <div className="list-message empty-state">
        <div className="empty-state-icon">☷</div>
        <h3>No tasks found</h3>
        <p>Your task list is empty. Add a new task to get started.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
          busyId={busyId}
        />
      ))}
    </div>
  );
}
