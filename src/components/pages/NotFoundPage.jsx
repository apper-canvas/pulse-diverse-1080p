import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotFoundContent from '@/components/organisms/NotFoundContent';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <NotFoundContent onGoHome={handleGoHome} />
        </div>
    );
};

export default NotFoundPage;