import React from 'react';

const TodoItem = ({ todo, users, toggleTodo, deleteTodo, setFilter }) => {
  return (
    <li className={`todo-item card ${todo.completed ? 'completed' : ''}`}>
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
        <span className="checkmark"></span>
      </label>

      <div className="todo-content">
        <span className="todo-text">{todo.text}</span>

        <div className="todo-meta-details">
          <div className="todo-tags">
            {todo.tags && todo.tags.map(tag => (
              <span key={tag} className="tag-chip" onClick={() => setFilter(tag)}>
                {tag}
              </span>
            ))}
          </div>
          <div className="todo-assignees">
            <ul className="user-list">
              {todo.assignedTo && todo.assignedTo.map(name => {
                const user = users.find(u => u.name === name);
                if (!user) return null;
                return (
                  <li key={name} className="user-item">
                    <div className="user-info">
                      <img src={user.photo} alt={user.name} className="user-avatar" />
                      <div className="user-details">
                        <span className="user-name">{user.name}</span>
                        <span className="user-job">{user.jobTitle}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
        {/* You can place your delete icon SVG here */}
      </button>
    </li>
  );
};

export default TodoItem;