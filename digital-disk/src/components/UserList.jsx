import React from 'react';

// The base URL is available in Astro projects
const BASE_URL = import.meta.env.BASE_URL;

export default function UserList({ users, onUserClick, getButtonLabel, selectedUsers = [] }) {
    const selectedNames = selectedUsers.map(u => u.name);
    return (
        <ul className="user-list">
            {users.map(user => (
                <li
                    key={user.name}
                    className={`user-item${selectedNames.includes(user.name) ? ' selected' : ''}`}
                    onClick={() => onUserClick(user)}
                >
                    <div className="user-info">
                        {/* Prepend the BASE_URL to the image src */}
                        <img src={`${BASE_URL}${user.photo}`} alt={user.name} className="user-avatar" />
                        <div className="user-details">
                            <span className="user-name">{user.name}</span>
                            <span className="user-job">{user.jobTitle}</span>
                        </div>
                    </div>
                    <button className="user-count" type="button">
                        {getButtonLabel ? getButtonLabel(user) : ''}
                    </button>
                </li>
            ))}
        </ul>
    );
}