import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProFeatureProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    loadingComponent?: React.ReactNode;
}

export function ProFeature({
    children,
    fallback,
    loadingComponent = <div className="text-center p-4">Checking subscription...</div>
}: ProFeatureProps) {
    const { isPro, loading } = useAuth();

    if (loading) return <>{loadingComponent}</>;

    if (!isPro) {
        return fallback || (
            <div className="pro-feature-blocked border border-yellow-300 bg-yellow-50 rounded-lg p-6 max-w-md mx-auto my-6">
                <div className="text-center">
                    <div className="inline-block bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">Premium Feature Locked</h3>
                    <p className="text-yellow-700 mb-4">
                        This advanced feature is only available for Pro subscribers.
                        Upgrade to unlock enhanced security capabilities.
                    </p>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
                        onClick={() => window.location.href = '/pricing'}
                    >
                        Upgrade to Pro
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}