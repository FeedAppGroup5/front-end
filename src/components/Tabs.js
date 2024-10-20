import React from 'react';
import './tabs.css'

export default function Tabs ({items, activeItem, onTabChange}) {
    return (
        <div className="tabs">
            <ul>
                {items.map(item => (
                    <li key={item} onClick={() => onTabChange(item)}>
                        <div className={item === activeItem ? 'active' : ''}>{item}</div>
                    </li>
                ))}
            </ul>
        </div>
    )
}