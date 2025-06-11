import React from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import ApperIcon from '../components/ApperIcon';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      {/* Main Calculator */}
      <MainFeature />

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-center py-8 px-4 mt-12"
      >
        <div className="max-w-2xl mx-auto bg-white/50 rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ApperIcon name="AlertCircle" className="w-5 h-5 text-info" />
            <h3 className="font-heading font-semibold text-gray-700">
              Important Disclaimer
            </h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            BMI is a useful screening tool but doesn't account for muscle mass, bone density, 
            overall body composition, and racial and sex differences. Always consult with 
            healthcare professionals for comprehensive health assessment.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;