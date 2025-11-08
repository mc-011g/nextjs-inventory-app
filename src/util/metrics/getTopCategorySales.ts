import { baseURLUtil } from "../baseURLUtil";

export const getTopCategorySalesUtil = async (userIdToken: string) => {

    if (!userIdToken) {
        return;
    }

    const response = await fetch(`${baseURLUtil()}/api/metrics/top-category-sales`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch top category sales.');
    }

    const salesData = data?.topCategorySales ?? [];
    const topCategorySales = Array.isArray(salesData) ? salesData : [];

    return topCategorySales;
}