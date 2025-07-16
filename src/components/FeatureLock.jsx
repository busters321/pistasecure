import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

export function FeatureLock({ children, featureName }) {
  const { isPro, loading } = useSubscription();
  const navigate = useNavigate();

  if (loading) return <div className="min-h-[200px] flex items-center justify-center">Loading...</div>;
  if (isPro) return children;

  return (
    <div className="relative group">
      <div className="blur-sm pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-6 rounded-lg">
        <Lock className="w-10 h-10 text-yellow-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          {featureName || 'Premium Feature'} Locked
        </h3>
        <p className="text-gray-300 text-center mb-6 max-w-md">
          This feature requires a Pro subscription. Upgrade now to unlock all premium features.
        </p>
        <Button 
          className="bg-pistachio hover:bg-pistachio-dark text-black px-6 py-3 text-lg"
          onClick={() => navigate('/billing')}
        >
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}

export function ProOnly({ children }) {
  const { isPro, loading } = useSubscription();
  if (loading) return null;
  return isPro ? children : null;
}

export function SubscriptionBadge() {
  const { subscription, loading, isPro } = useSubscription();

  if (loading) {
    return (
      <div className="bg-gray-200 rounded-full px-3 py-1 text-sm animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className={`rounded-full px-4 py-1 text-sm font-medium ${
      isPro 
        ? 'bg-pistachio text-black' 
        : 'bg-gray-200 text-gray-800'
    }`}>
      {isPro ? 'PRO MEMBER' : 'FREE PLAN'}
    </div>
  );
}