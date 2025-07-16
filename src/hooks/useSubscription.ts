import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth';

export function useSubscription(user: User | null) {
    const [isPro, setIsPro] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsPro(false);
            setLoading(false);
            return;
        }

        const userRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                const subscription = data.subscription || {};
                setIsPro(
                    subscription.plan === 'pro' &&
                    subscription.status === 'active'
                );
            } else {
                setIsPro(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return { isPro, loading };
}