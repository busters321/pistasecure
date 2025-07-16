import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProRoute({ children }: { children: React.ReactNode }) {
    const { isPro, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!isPro) {
        return <Navigate to="/pricing" replace />;
    }

    return <>{children}</>;
}