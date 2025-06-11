import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const HeaderSection = () => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8 px-4"
        >
            <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                    <ApperIcon name="Heart" className="w-8 h-8 text-primary" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-800">
                    BMI Pulse
                </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
                Calculate your Body Mass Index instantly with gentle, real-time feedback
            </p>
        </motion.header>
    );
};

export default HeaderSection;