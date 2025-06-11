import React from 'react';
import { motion } from 'framer-motion';

const UnitToggle = ({ unit, onToggle }) => {
    return (
        <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Units
            </label>
            <div className="relative bg-surface rounded-full p-1 shadow-inner">
                <motion.div
                    className="absolute inset-y-1 bg-primary rounded-full shadow-sm"
                    initial={false}
                    animate={{
                        x: unit === 'metric' ? 0 : '100%',
                        width: '50%'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <div className="relative flex">
                    <button
                        onClick={onToggle}
                        className={`flex-1 text-center py-3 px-6 rounded-full font-medium transition-colors duration-200 ${
                            unit === 'metric' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Metric
                    </button>
                    <button
                        onClick={onToggle}
                        className={`flex-1 text-center py-3 px-6 rounded-full font-medium transition-colors duration-200 ${
                            unit === 'imperial' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Imperial
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnitToggle;