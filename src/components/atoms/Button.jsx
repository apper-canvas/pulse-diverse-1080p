import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className, ...props }) => {
    return (
        <motion.button
            onClick={onClick}
            className={className}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;