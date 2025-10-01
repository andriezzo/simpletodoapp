import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import TodoItem from './TodoItem';
import TodoInputForm from './TodoInputForm'; // Import the new component


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
                <UserList
                    users={tasksByUser}
                    onUserClick={user => setFilter(user.name)}
                    getButtonLabel={user => `${user.activeTasks} Active`}
                />
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

    const filteredTodos = getFilteredTodos();
    const currentFilterLabel = 
        filter === 'all' ? 'All Tasks' :
        filter === 'active' ? 'Active Tasks' :
        filter === 'completed' ? 'Completed Tasks' :
        uniqueTags.includes(filter) ? `Tag: ${filter}` :
        users.some(u => u.name === filter) ? `Assigned to: ${filter}` : 'Filtered Tasks';
        
    return (
        <div className="todo-section block">
            <h1 className="page-title">Simple To-Do App</h1>
            <p className="page-subtitle">Manage your tasks efficiently with tags and user assignments.</p>
            
            {/* Input Section is now its own component */}
            <TodoInputForm
                addTodo={addTodo}
                users={users}
                uniqueTags={uniqueTags}
            />

            <div className="todo-list-container container">
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
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            users={users}
                            toggleTodo={toggleTodo}
                            deleteTodo={deleteTodo}
                            setFilter={setFilter}
                        />
                    ))
                )}
            </ul>
            </div>
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
            
            {/*  Summary/Dashboard */}
            <TodoSummary todos={todos} setFilter={setFilter} users={users} />

            {/*  Input and List */}
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
