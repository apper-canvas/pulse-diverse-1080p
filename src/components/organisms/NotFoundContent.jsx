import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundContent = ({ onGoHome }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
        >
            <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
            >
                <ApperIcon name="Heart" className="w-16 h-16 text-primary mx-auto" />
            </motion.div>

            <h1 className="text-4xl font-heading font-bold text-gray-800 mb-4">
                Page Not Found
            </h1>

            <p className="text-gray-600 mb-8">
                Let's get you back to calculating your BMI
            </p>

            <Button
                onClick={onGoHome}
                className="bg-primary text-white px-6 py-3 rounded-xl font-medium shadow-soft hover:shadow-glow transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Go to Calculator
            </Button>
        </motion.div>
    );
};

export default NotFoundContent;