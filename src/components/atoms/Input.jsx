import React from 'react';

const Input = ({ className, error, ...props }) => {
    return (
        <input
            className={`w-full px-4 py-4 bg-surface border-2 rounded-xl input-glow focus:outline-none focus:border-primary transition-all duration-200 text-lg ${
                error ? 'border-error' : 'border-gray-200'
            } ${className || ''}`}
            {...props}
        />
    );
};

export default Input;