import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ResultCard = ({ bmi, category }) => {
    const getBMIColor = (cat) => {
        switch (cat?.toLowerCase()) {
            case 'underweight': return 'bg-underweight border-blue-200';
            case 'normal': return 'bg-normal border-green-200';
            case 'overweight': return 'bg-overweight border-orange-200';
            case 'obese': return 'bg-obese border-red-200';
            default: return 'bg-white border-gray-200';
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={bmi ? 'result' : 'empty'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`p-8 rounded-3xl shadow-soft border-2 ${getBMIColor(category)}`}
            >
                {bmi ? (
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mb-4"
                        >
                            <div className="text-5xl font-heading font-bold text-gray-800 bmi-number">
                                {bmi.toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">BMI</div>
                        </motion.div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full"
                        >
                            <div className={`w-3 h-3 rounded-full ${
                                category === 'Underweight' ? 'bg-blue-400' :
                                category === 'Normal' ? 'bg-green-400' :
                                category === 'Overweight' ? 'bg-orange-400' :
                                'bg-red-400'
                            }`}></div>
                            <span className="font-medium text-gray-700">{category}</span>
                        </motion.div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <ApperIcon name="Calculator" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-xl font-heading font-semibold text-gray-600 mb-2">
                            Enter Your Details
                        </h3>
                        <p className="text-gray-500">
                            Your BMI will appear here instantly as you type
                        </p>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default ResultCard;