import React, { useState, useEffect } from 'react';


// --- 1. TodoSummary Component (Left Sidebar) ---
const TodoSummary = ({ todos, setFilter, users }) => {
    const total = todos.length;
    const active = todos.filter(todo => !todo.completed).length;
    const completed = total - active;

    const tasksByUser = users.map(user => ({
        ...user,
        activeTasks: todos.filter(todo => todo.assignedTo.includes(user.name) && !todo.completed).length,
    }));

    const tags = todos.flatMap(todo => todo.tags).reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {});

    const sortedTags = Object.entries(tags)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 10); // Top 10 tags

    return (
        <aside className=" summary">
            <h2 className="title">Dashboard Summary</h2>
            
            <section className="stat-section container">
                <h3 className="title">Task Status</h3>
                <div className="status-grid">
                    <button className="stat-box total" onClick={() => setFilter('all')}>
                        <span className="stat-count">{total}</span>
                        <span className="stat-label">Total Tasks</span>
                    </button>
                    <button className="stat-box active" onClick={() => setFilter('active')}>
                        <span className="stat-count">{active}</span>
                        <span className="stat-label">Active</span>
                    </button>
                    <button className="stat-box completed" onClick={() => setFilter('completed')}>
                        <span className="stat-count">{completed}</span>
                        <span className="stat-label">Completed</span>
                    </button>
                </div>
            </section>

            <section className="container user-section">
                <h3 className="title">Tasks by User</h3>
                <ul className="user-list">
                    {tasksByUser.map(user => (
                        <li key={user.name} className="user-item">
                            <div className="user-info">
                                <img src={user.photo} alt={user.name} className="user-avatar" />
                                <div className="user-details">
                                    <span className="user-name">{user.name}</span>
                                    <span className="user-job">{user.jobTitle}</span>
                                </div>
                            </div>
                            <button className="user-count" onClick={() => setFilter(user.name)}>
                                {user.activeTasks} Active
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="container tag-section">
                <h3 className="title">Top Tags</h3>
                <div className="tag-list">
                    {sortedTags.length > 0 ? (
                        sortedTags.map(([tag, count]) => (
                            <button 
                                key={tag} 
                                className="tag-item"
                                onClick={() => setFilter(tag)}
                            >
                                <span className="tag-name">{tag}</span>
                                <span className="tag-count">({count})</span>
                            </button>
                        ))
                    ) : (
                        <p className="no-tags">No tags found.</p>
                    )}
                </div>
            </section>
        </aside>
    );
};

// --- 2. TodoList Component (Right Main Area) ---
const TodoList = ({ todos, addTodo, toggleTodo, deleteTodo, filter, setFilter, uniqueTags, users }) => {
    const [inputValue, setInputValue] = useState('');
    const [tagValue, setTagValue] = useState('');
    const [showTags, setShowTags] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    // Logic to filter the list based on the current filter state
    const getFilteredTodos = () => {
        if (filter === 'active') {
            return todos.filter(todo => !todo.completed);
        }
        if (filter === 'completed') {
            return todos.filter(todo => todo.completed);
        }
        if (uniqueTags.includes(filter)) {
            return todos.filter(todo => todo.tags.map(t => t.toLowerCase()).includes(filter.toLowerCase()));
        }
        if (users.some(u => u.name === filter)) {
            return todos.filter(todo => todo.assignedTo.includes(filter));
        }
        return todos;
    };

    // Handler for adding a task
    const handleAddTodo = () => {
      const assignedUserNames = selectedUsers.map(user => user.name);
      addTodo(inputValue, tagValue, assignedUserNames);
      setInputValue('');
      setTagValue('');
      setSelectedUsers([]);
    };

    // Handlers for tag autocomplete
    const handleTagInputFocus = () => { setShowTags(true); };
    const handleTagInputBlur = () => { setTimeout(() => setShowTags(false), 200); };
    const handleTagClick = (tag) => {
      setTagValue(prevValue => {
        const cleanedTag = tag.replace(/^#/, '');
        if (prevValue.trim() === '') {
            return `${cleanedTag}`;
        } else {
            return `${prevValue.trim()}, ${cleanedTag}`;
        }
      });
      setShowTags(false);
    };
    
    // Handler for assigning users
    const handleUserToggle = (user) => {
        setSelectedUsers(prevSelectedUsers => {
            if (prevSelectedUsers.find(u => u.name === user.name)) {
                return prevSelectedUsers.filter(u => u.name !== user.name);
            } else {
                return [...prevSelectedUsers, user];
            }
        });
    };

    // Filter suggestions based on current tag input
    const currentInputTag = tagValue.split(',').pop()?.trim().toLowerCase().replace(/^#/, '') || '';
    const filteredSuggestions = uniqueTags.filter(tag => 
        tag.toLowerCase().includes(currentInputTag)
    ).slice(0, 5);

    const filteredTodos = getFilteredTodos();
    const currentFilterLabel = 
        filter === 'all' ? 'All Tasks' :
        filter === 'active' ? 'Active Tasks' :
        filter === 'completed' ? 'Completed Tasks' :
        uniqueTags.includes(filter) ? `Tag: ${filter}` :
        users.some(u => u.name === filter) ? `Assigned to: ${filter}` : 'Filtered Tasks';
        
    // Component for handling user assignment selection
    const UserAssignment = ({ users, selectedUsers, onToggle }) => {
        const selectedNames = selectedUsers.map(u => u.name);
        return (
            <div className="user-assignment">
                <span className="assignment-label">Assign to:</span>
                <div className="user-chips-container">
                    {users.map(user => (
                        <button
                            key={user.name}
                            className={`user-chip ${selectedNames.includes(user.name) ? 'active' : ''}`}
                            onClick={() => onToggle(user)}
                        >
                            <img
                                src={user.photo}
                                alt={user.name}
                                className="user-avatar"
                            />
                            {selectedNames.includes(user.name) ? '✔' : ''} {user.name}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="todo-section">
            <h1 className="page-title">Task Board</h1>
            
            {/* Input Section */}
            <div className="input-section block">
                <div className="input-group">

                <input 
                    type="text" 
                    className="task-input"
                    placeholder="New task description..." 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                />  
                </div>
                
                
                <div className="input-group meta-inputs">
                    {/* Tags Input with Autocomplete */}
                    <div className="tags-input-group">
                        <input 
                            type="text" 
                            className="tags-input"
                            placeholder="Add tags (e.g., urgent, design)" 
                            value={tagValue}
                            onChange={(e) => setTagValue(e.target.value)}
                            onFocus={handleTagInputFocus}
                            onBlur={handleTagInputBlur}
                        />
                        {showTags && filteredSuggestions.length > 0 && (
                            <div className="tag-autocomplete">
                                {filteredSuggestions.map(tag => (
                                    <span 
                                        key={tag} 
                                        className="tag-suggestion" 
                                        // Use onMouseDown to trigger before input blur
                                        onMouseDown={(e) => { e.preventDefault(); handleTagClick(tag); }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* User Assignment Dropdown */}
                    <UserAssignment 
                        users={users} 
                        selectedUsers={selectedUsers} 
                        onToggle={handleUserToggle} 
                    />
                </div>

                <button 
                    className="add-button button" 
                    onClick={handleAddTodo}
                    disabled={inputValue.trim() === ''}
                >
                    Add Task
                </button>
            </div>

            {/* List and Filter Section */}
            <div className="list-filters">
                <h2 className="filter-label">{currentFilterLabel} ({filteredTodos.length})</h2>
                <div className="filter-buttons">
                    {/* Filter buttons for the main list */}
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
                        onClick={() => setFilter('all')}
                    >All</button>
                    <button 
                        className={`filter-btn ${filter === 'active' ? 'active' : ''}`} 
                        onClick={() => setFilter('active')}
                    >Active</button>
                    <button 
                        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} 
                        onClick={() => setFilter('completed')}
                    >Completed</button>
                </div>
            </div>

            {/* Todo List */}
            <ul className="todo-list">
                {filteredTodos.length === 0 ? (
                    <li className="empty-state card">No tasks found for the current filter.</li>
                ) : (
                    filteredTodos.map(todo => (
                        <li key={todo.id} className={`todo-item card ${todo.completed ? 'completed' : ''}`}>
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
                                        {todo.assignedTo && todo.assignedTo.map(name => {
                                            const user = users.find(u => u.name === name);
                                            return (
                                                <span key={name} className="assignee-chip" onClick={() => setFilter(`${name}`)}>
                                                    {user && (
                                                        <img
                                                            src={user.photo}
                                                            alt={user.name}
                                                            className="user-avatar"
                                                        />
                                                    )}
                                                    {name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                                
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

// --- 3. Main App Component (Entry Point) ---
// This handles global state and layout structure.
export default function TodoApp({ users }) {

    // State management for the entire list, loading from localStorage on startup
    const [todos, setTodos] = useState(() => {
        if (typeof window === 'undefined') return [];
        try {
            const storedTodos = localStorage.getItem('react-todos');
            return storedTodos ? JSON.parse(storedTodos) : [];
        } catch (error) {
            console.error("Could not load todos from local storage", error);
            return [];
        }
    });

    const [filter, setFilter] = useState('all');
    const [uniqueTags, setUniqueTags] = useState([]);
    
    // Effect to save todos to local storage whenever the 'todos' state changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('react-todos', JSON.stringify(todos));
            } catch (error) {
                console.error("Could not save todos to local storage", error);
            }
        }
    }, [todos]);

    // Effect to update the list of unique tags for the summary/autocomplete
    useEffect(() => {
        const allTags = todos.flatMap(todo => todo.tags || []);
        const unique = [...new Set(allTags)];
        setUniqueTags(unique);
    }, [todos]);

    // Function to add a new todo item
    const addTodo = (inputValue, tagValue, assignedTo) => {
        if (inputValue.trim() !== '') {
            const tags = tagValue
                .split(',')
                .map(tag => tag.trim().replace(/^#/, ''))
                .filter(tag => tag !== '');

            const newTodo = {
                id: Date.now(),
                text: inputValue,
                completed: false,
                tags: tags,
                assignedTo: assignedTo || [],
            };
            setTodos([...todos, newTodo]);
        }
    };

    // Function to toggle the completion status of a todo
    const toggleTodo = (id) => {
        const updatedTodos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
    };

    // Function to delete a todo item
    const deleteTodo = (id) => {
        const filteredTodos = todos.filter(todo => todo.id !== id);
        setTodos(filteredTodos);
    };

    return (
        <div className="dashboard-grid container">
            
            {/* Left side: Summary/Dashboard */}
            <TodoSummary todos={todos} setFilter={setFilter} users={users} />

            {/* Right side: Input and List */}
            <TodoList
                todos={todos}
                addTodo={addTodo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                filter={filter}
                setFilter={setFilter}
                uniqueTags={uniqueTags}
                users={users}
            />
            
        </div>
    );
};
