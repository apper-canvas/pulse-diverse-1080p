import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const FooterSection = () => {
    return (
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
    );
};

export default FooterSection;