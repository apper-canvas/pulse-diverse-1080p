import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import bmiService from '@/services/api/bmiService';
import userPreferencesService from '@/services/api/userPreferencesService';

import UnitToggle from '@/components/molecules/UnitToggle';
import FormField from '@/components/molecules/FormField';
import ResultCard from '@/components/molecules/ResultCard';
import BMICategoryItem from '@/components/molecules/BMICategoryItem';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const BMICalculator = () => {
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
            if (!isValidInput()) {
                setBmi(null);
                setCategory('');
                return;
            }

            setLoading(true);
setErrors({});

            try {
                let heightInCm, weightInKg;

                if (unit === 'metric') {
                    heightInCm = parseFloat(height);
                    weightInKg = parseFloat(weight);
                } else {
                    // Convert imperial to metric - handle optional inches
                    const feet = parseFloat(heightFeet) || 0;
                    const inches = parseFloat(heightInches) || 0;
                    const totalInches = feet * 12 + inches;
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

                // Save preferences - handle optional inches
                const savedHeight = unit === 'metric' 
                    ? heightInCm 
                    : ((parseFloat(heightFeet) || 0) * 12 + (parseFloat(heightInches) || 0));
                
                await userPreferencesService.create({
                    defaultUnit: unit,
                    savedHeight,
                    theme: 'light'
                });

            } catch (error) {
                setErrors({ general: error.message });
                toast.error('Calculation error: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        const inputsProvided = (unit === 'metric' && (height || weight)) ||
                             (unit === 'imperial' && (heightFeet || heightInches || weight));
        if (inputsProvided) {
            const debounceTimer = setTimeout(calculateBMI, 300);
            return () => clearTimeout(debounceTimer);
        } else {
            setBmi(null);
            setCategory('');
            setErrors({});
        }

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
            // Allow empty inches (defaults to 0), but validate if provided
            if (heightInches && (isNaN(inches) || inches < 0 || inches >= 12)) {
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
        setHeight('');
        setWeight('');
        setHeightFeet('');
        setHeightInches('');
        setBmi(null);
        setCategory('');
        setErrors({});
};

    const handleSeeResult = async () => {
        if (!isValidInput()) {
            toast.error('Please enter valid height and weight values');
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            let heightInCm, weightInKg;

            if (unit === 'metric') {
                heightInCm = parseFloat(height);
                weightInKg = parseFloat(weight);
            } else {
                // Convert imperial to metric - handle optional inches
                const feet = parseFloat(heightFeet) || 0;
                const inches = parseFloat(heightInches) || 0;
                const totalInches = feet * 12 + inches;
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

            // Save preferences - handle optional inches
            const savedHeight = unit === 'metric' 
                ? heightInCm 
                : ((parseFloat(heightFeet) || 0) * 12 + (parseFloat(heightInches) || 0));
            
            await userPreferencesService.create({
                defaultUnit: unit,
                savedHeight,
                theme: 'light'
            });

            toast.success('BMI calculated successfully!');

        } catch (error) {
            setErrors({ general: error.message });
            toast.error('Failed to calculate BMI. Please try again.');
        } finally {
            setLoading(false);
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
                    <UnitToggle unit={unit} onToggle={handleUnitToggle} />

                    {/* Height Input */}
                    {unit === 'metric' ? (
                        <FormField
                            label="Height"
                            unitLabel="(cm)"
                            error={errors.height}
                        >
                            <div className="relative">
                                <Input
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="Enter height in cm"
                                    error={errors.height}
                                />
                                <ApperIcon name="Ruler" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </FormField>
                    ) : (
                        <FormField
                            label="Height"
                            unitLabel="(ft/in)"
                            error={errors.heightFeet || errors.heightInches}
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <Input
                                        value={heightFeet}
                                        onChange={(e) => setHeightFeet(e.target.value)}
                                        placeholder="Feet"
                                        error={errors.heightFeet}
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">ft</span>
                                </div>
                                <div className="relative">
                                    <Input
                                        value={heightInches}
                                        onChange={(e) => setHeightInches(e.target.value)}
                                        placeholder="Inches"
                                        error={errors.heightInches}
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">in</span>
                                </div>
                            </div>
                        </FormField>
                    )}

                    {/* Weight Input */}
                    <FormField
                        label="Weight"
                        unitLabel={unit === 'metric' ? '(kg)' : '(lbs)'}
                        error={errors.weight}
                    >
                        <div className="relative">
                            <Input
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder={`Enter weight in ${unit === 'metric' ? 'kg' : 'lbs'}`}
                                error={errors.weight}
                            />
                            <ApperIcon name="Scale" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
</FormField>

                    {/* See Result Button */}
                    <Button
                        onClick={handleSeeResult}
                        disabled={loading}
                        className="w-full bg-accent text-gray-700 py-4 rounded-xl font-medium shadow-soft hover:shadow-glow transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <ApperIcon name="Calculator" size={20} />
                        {loading ? 'Calculating...' : 'See Result'}
                    </Button>
                </motion.div>

                {/* Results Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-6"
                >
                    <ResultCard bmi={bmi} category={category} />

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
                                <BMICategoryItem
                                    key={item.category}
                                    range={item.range}
                                    category={item.category}
                                    color={item.color}
                                    isActive={category === item.category.split(' ')[0]}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BMICalculator;