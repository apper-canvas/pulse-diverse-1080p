import React from 'react';
import { motion } from 'framer-motion';

const FormField = ({
    label,
    error,
    children, // This will be the actual input elements (Input atoms or combination of them)
    unitLabel // e.g., '(cm)', '(ft/in)', '(kg)', '(lbs)'
}) => {
    const showError = error && error !== '';

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {unitLabel}
            </label>
            {children} {/* This is where the Input (or Inputs for imperial) will be rendered */}
            {showError && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-error text-sm mt-2"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default FormField;