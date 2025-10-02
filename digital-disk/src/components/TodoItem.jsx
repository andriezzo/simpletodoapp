import React from 'react';
import UserList from './UserList'; // 1. Import the UserList component

const TodoItem = ({ todo, users, toggleTodo, deleteTodo, setFilter }) => {
  // 2. Prepare the list of assigned users
  const assignedUsers = users.filter(user => todo.assignedTo.includes(user.name));

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
            {/* 3. Use the UserList component here */}
            <UserList
              users={assignedUsers}
              onUserClick={(user) => setFilter(user.name)}
            />
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