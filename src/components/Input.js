import React from 'react';

export const Input = ({ value, onChange }) => {
    return (
        <input className="input"
            value={value}
            onChange={onChange} />
    )
}