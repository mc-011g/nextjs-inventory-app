import { baseURLUtil } from "../baseURLUtil";

export const getTotalUniqueProductsUtil = async (userIdToken: string) => {
    
    if (!userIdToken) {
        return;
    }

    const response = await fetch(`${baseURLUtil()}/api/metrics/total-unique-products`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? "Failed to get total unique products.");
    }

    return data;
}