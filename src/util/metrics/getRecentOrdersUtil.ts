import { baseURLUtil } from "../baseURLUtil";

export const getRecentOrdersUtil = async (userIdToken: string) => {

    if (!userIdToken) {
        return;
    }

    const response = await fetch(`${baseURLUtil()}/api/metrics/recent-orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error("Failed to get total unique products.");
    }

    const recentOrdersData = data?.recentOrders ?? [];
    const recentOrders = Array.isArray(recentOrdersData) ? recentOrdersData : [];

    return recentOrders;
}