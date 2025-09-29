import React from 'react';

export default function UserList({ users, onUserClick, getButtonLabel }) {
    return (
        <ul className="user-list">
            {users.map(user => (
                <li key={user.name} className="user-item">
                    <div className="user-info">
                        <img src={user.photo} alt={user.name} className="user-avatar" />
                        <div className="user-details">
                            <span className="user-name">{user.name}</span>
                            <span className="user-job">{user.jobTitle}</span>
                        </div>
                    </div>
                    <button className="user-count" onClick={() => onUserClick(user)}>
                        {getButtonLabel ? getButtonLabel(user) : null}
                    </button>
                </li>
            ))}
        </ul>
    );
}