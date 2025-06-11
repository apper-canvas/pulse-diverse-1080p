import React from 'react';
import HeaderSection from '@/components/organisms/HeaderSection';
import BMICalculator from '@/components/organisms/BMICalculator';
import FooterSection from '@/components/organisms/FooterSection';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-background">
            <HeaderSection />
            <BMICalculator />
            <FooterSection />
        </div>
    );
};

export default HomePage;