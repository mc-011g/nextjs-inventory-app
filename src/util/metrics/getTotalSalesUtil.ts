import { baseURLUtil } from "../baseURLUtil";

export const getTotalSalesUtil = async (userIdToken: string) => {

    if (!userIdToken) {
        return;
    }

    const response = await fetch(`${baseURLUtil()}/api/metrics/total-sales`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch total sales.');
    }

    return data;
}