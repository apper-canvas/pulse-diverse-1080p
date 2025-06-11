import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import bmiService from '../services/api/bmiService';
import userPreferencesService from '../services/api/userPreferencesService';

const MainFeature = () => {
  const [unit, setUnit] = useState('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load user preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await userPreferencesService.getAll();
        if (prefs.length > 0) {
          const userPref = prefs[0];
          setUnit(userPref.defaultUnit);
          if (userPref.savedHeight) {
            if (userPref.defaultUnit === 'metric') {
              setHeight(userPref.savedHeight.toString());
            } else {
              const feet = Math.floor(userPref.savedHeight / 12);
              const inches = userPref.savedHeight % 12;
              setHeightFeet(feet.toString());
              setHeightInches(inches.toString());
            }
          }
        }
      } catch (error) {
        console.log('No saved preferences found');
      }
    };
    loadPreferences();
  }, []);

  // Real-time BMI calculation
  useEffect(() => {
    const calculateBMI = async () => {
      if (!isValidInput()) return;

      setLoading(true);
      setErrors({});

      try {
        let heightInCm, weightInKg;

        if (unit === 'metric') {
          heightInCm = parseFloat(height);
          weightInKg = parseFloat(weight);
        } else {
          // Convert imperial to metric
          const totalInches = parseFloat(heightFeet) * 12 + parseFloat(heightInches);
          heightInCm = totalInches * 2.54;
          weightInKg = parseFloat(weight) * 0.453592;
        }

        const calculation = {
          height: heightInCm,
          weight: weightInKg,
          unit,
          timestamp: new Date()
        };

        const result = await bmiService.create(calculation);
        setBmi(result.bmi);
        setCategory(result.category);

        // Save preferences
        await userPreferencesService.create({
          defaultUnit: unit,
          savedHeight: unit === 'metric' ? heightInCm : (parseFloat(heightFeet) * 12 + parseFloat(heightInches)),
          theme: 'light'
        });

      } catch (error) {
        setErrors({ general: error.message });
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(calculateBMI, 300);
    return () => clearTimeout(debounceTimer);
  }, [height, weight, heightFeet, heightInches, unit]);

  const isValidInput = () => {
    const newErrors = {};

    if (unit === 'metric') {
      const h = parseFloat(height);
      const w = parseFloat(weight);

      if (!height || isNaN(h) || h < 50 || h > 300) {
        newErrors.height = 'Height must be between 50-300 cm';
      }
      if (!weight || isNaN(w) || w < 20 || w > 500) {
        newErrors.weight = 'Weight must be between 20-500 kg';
      }
    } else {
      const feet = parseFloat(heightFeet);
      const inches = parseFloat(heightInches);
      const w = parseFloat(weight);

      if (!heightFeet || isNaN(feet) || feet < 3 || feet > 8) {
        newErrors.heightFeet = 'Feet must be between 3-8';
      }
      if (!heightInches || isNaN(inches) || inches < 0 || inches >= 12) {
        newErrors.heightInches = 'Inches must be between 0-11';
      }
      if (!weight || isNaN(w) || w < 44 || w > 1100) {
        newErrors.weight = 'Weight must be between 44-1100 lbs';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUnitToggle = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    // Clear inputs when switching units
    setHeight('');
    setWeight('');
    setHeightFeet('');
    setHeightInches('');
    setBmi(null);
    setCategory('');
    setErrors({});
  };

  const handleReset = () => {
    setHeight('');
    setWeight('');
    setHeightFeet('');
    setHeightInches('');
    setBmi(null);
    setCategory('');
    setErrors({});
    toast.success('Calculator reset successfully');
  };

  const getBMIColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'underweight': return 'bg-underweight border-blue-200';
      case 'normal': return 'bg-normal border-green-200';
      case 'overweight': return 'bg-overweight border-orange-200';
      case 'obese': return 'bg-obese border-red-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const BMICategories = [
    { range: 'Below 18.5', category: 'Underweight', color: 'bg-underweight text-blue-700' },
    { range: '18.5 - 24.9', category: 'Normal Weight', color: 'bg-normal text-green-700' },
    { range: '25.0 - 29.9', category: 'Overweight', color: 'bg-overweight text-orange-700' },
    { range: '30.0 and above', category: 'Obese', color: 'bg-obese text-red-700' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Calculator Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 shadow-soft"
        >
          {/* Unit Toggle */}
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
                  onClick={handleUnitToggle}
                  className={`flex-1 text-center py-3 px-6 rounded-full font-medium transition-colors duration-200 ${
                    unit === 'metric' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Metric
                </button>
                <button
                  onClick={handleUnitToggle}
                  className={`flex-1 text-center py-3 px-6 rounded-full font-medium transition-colors duration-200 ${
                    unit === 'imperial' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Imperial
                </button>
              </div>
            </div>
          </div>

          {/* Height Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height {unit === 'metric' ? '(cm)' : '(ft/in)'}
            </label>
            {unit === 'metric' ? (
              <div className="relative">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter height in cm"
                  className={`w-full px-4 py-4 bg-surface border-2 rounded-xl input-glow focus:outline-none focus:border-primary transition-all duration-200 text-lg ${
                    errors.height ? 'border-error' : 'border-gray-200'
                  }`}
                />
                <ApperIcon name="Ruler" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    placeholder="Feet"
                    className={`w-full px-4 py-4 bg-surface border-2 rounded-xl input-glow focus:outline-none focus:border-primary transition-all duration-200 text-lg ${
                      errors.heightFeet ? 'border-error' : 'border-gray-200'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">ft</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    placeholder="Inches"
                    className={`w-full px-4 py-4 bg-surface border-2 rounded-xl input-glow focus:outline-none focus:border-primary transition-all duration-200 text-lg ${
                      errors.heightInches ? 'border-error' : 'border-gray-200'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">in</span>
                </div>
              </div>
            )}
            {(errors.height || errors.heightFeet || errors.heightInches) && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-error text-sm mt-2"
              >
                {errors.height || errors.heightFeet || errors.heightInches}
              </motion.p>
            )}
          </div>

          {/* Weight Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight {unit === 'metric' ? '(kg)' : '(lbs)'}
            </label>
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={`Enter weight in ${unit === 'metric' ? 'kg' : 'lbs'}`}
                className={`w-full px-4 py-4 bg-surface border-2 rounded-xl input-glow focus:outline-none focus:border-primary transition-all duration-200 text-lg ${
                  errors.weight ? 'border-error' : 'border-gray-200'
                }`}
              />
              <ApperIcon name="Scale" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.weight && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-error text-sm mt-2"
              >
                {errors.weight}
              </motion.p>
            )}
          </div>

          {/* Reset Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className="w-full bg-accent text-gray-700 py-4 rounded-xl font-medium shadow-soft hover:shadow-glow transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ApperIcon name="RotateCcw" size={20} />
            Reset Calculator
          </motion.button>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {/* BMI Result Card */}
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

          {/* BMI Categories Guide */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <ApperIcon name="Info" className="w-5 h-5 text-info" />
              <h3 className="font-heading font-semibold text-gray-700">
                BMI Categories
              </h3>
            </div>
            <div className="space-y-3">
              {BMICategories.map((item, index) => (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-xl ${item.color} ${
                    category === item.category.split(' ')[0] ? 'ring-2 ring-primary ring-opacity-50' : ''
                  }`}
                >
                  <span className="font-medium">{item.category}</span>
                  <span className="text-sm opacity-80">{item.range}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeature;