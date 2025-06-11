import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
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
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-3 rounded-xl font-medium shadow-soft hover:shadow-glow transition-all duration-200"
        >
          Go to Calculator
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;