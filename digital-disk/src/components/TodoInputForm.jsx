import React, { useState, useEffect } from 'react';
import UserList from './UserList';

const TodoInputForm = ({ addTodo, users, uniqueTags }) => {
    const [inputValue, setInputValue] = useState('');
    const [tagValue, setTagValue] = useState('');
    const [showTags, setShowTags] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [inputTagInput, setInputTagInput] = useState('');

    useEffect(() => {
        if (inputTagInput && filteredSuggestions.length > 0) {
            setShowTags(true);
        }
    }, [inputTagInput]);

    const handleAddTodo = () => {
        const assignedUserNames = selectedUsers.map(user => user.name);
        let tags = tagValue.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        if (inputTagInput && !tags.includes(inputTagInput.trim())) {
            tags.push(inputTagInput.trim());
        }
        addTodo(inputValue, tags.join(', '), assignedUserNames);
        setInputValue('');
        setTagValue('');
        setInputTagInput('');
        setSelectedUsers([]);
    };

    const handleTagInputFocus = () => setShowTags(true);
    const handleTagInputBlur = () => setTimeout(() => setShowTags(false), 200);

    const handleUserToggle = (user) => {
        setSelectedUsers(prev =>
            prev.find(u => u.name === user.name)
                ? prev.filter(u => u.name !== user.name)
                : [...prev, user]
        );
    };

    const filteredSuggestions = uniqueTags
        .filter(tag =>
            inputTagInput && tag.toLowerCase().includes(inputTagInput.trim().toLowerCase()) &&
            !tagValue.split(',').map(t => t.trim().toLowerCase()).includes(tag.toLowerCase())
        )
        .slice(0, 5);

    return (
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
                <div className="field-legend tags-instructions">
                    <legend>Select a suggested tag or add a new one and press Enter.</legend>
                </div>
                <div className="tags-list">
                    {tagValue.split(',').map((tag, idx) => {
                        const trimmed = tag.trim();
                        if (!trimmed) return null;
                        return (
                            <span className="tag-chip tag-edit" key={idx}>
                                {trimmed}
                                <button
                                    type="button"
                                    className="tag-remove"
                                    onClick={() => {
                                        const tags = tagValue.split(',').map(t => t.trim()).filter(Boolean);
                                        tags.splice(idx, 1);
                                        setTagValue(tags.join(', '));
                                    }}
                                    aria-label={`Remove tag ${trimmed}`}
                                >
                                    ×
                                </button>
                            </span>
                        );
                    })}
                    <input
                        type="text"
                        className="tags-input"
                        placeholder="Add tags..."
                        value={inputTagInput}
                        onChange={e => setInputTagInput(e.target.value)}
                        onFocus={handleTagInputFocus}
                        onBlur={handleTagInputBlur}
                        onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                const newTag = inputTagInput.trim();
                                if (newTag && !tagValue.split(',').map(t => t.trim()).includes(newTag)) {
                                    setTagValue(tagValue ? `${tagValue}, ${newTag}` : newTag);
                                }
                                setInputTagInput('');
                            }
                        }}
                    />
                </div>
                {showTags && filteredSuggestions.length > 0 && (
                    <div className="tag-autocomplete">
                        {filteredSuggestions.map(tag => (
                            <span
                                key={tag}
                                className="tag-suggestion"
                                onMouseDown={e => {
                                    e.preventDefault();
                                    const tags = tagValue.split(',').map(t => t.trim()).filter(Boolean);
                                    if (!tags.includes(tag)) {
                                        setTagValue(tags.length ? `${tags.join(', ')}, ${tag}` : tag);
                                    }
                                    setInputTagInput('');
                                    setShowTags(false);
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <UserList
                    users={users}
                    onUserClick={handleUserToggle}
                    getButtonLabel={user => selectedUsers.some(u => u.name === user.name) ? '✔' : ''}
                    selectedUsers={selectedUsers}
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
    );
};

export default TodoInputForm;