export interface Subscription {
    plan: string;
    status: string;
}

export function isUserAccountActive(subscription: Subscription | null): boolean {
    return subscription?.status === "active";
}

export function canAccessFeature(
    userSubscription: Subscription | null,
    featureName: string
): boolean {
    if (!isUserAccountActive(userSubscription)) return false;

    if (featureName === "advancedFeature" && userSubscription?.plan !== "pro") {
        return false;
    }

    return true;
}
