import React from 'react';
import { motion } from 'framer-motion';

const BMICategoryItem = ({ range, category, color, isActive, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-xl ${color} ${
                isActive ? 'ring-2 ring-primary ring-opacity-50' : ''
            }`}
        >
            <span className="font-medium">{category}</span>
            <span className="text-sm opacity-80">{range}</span>
        </motion.div>
    );
};

export default BMICategoryItem;