import { baseURLUtil } from "../baseURLUtil";

export const getOrdersUtil = async (userIdToken: string) => {

    if (!userIdToken) {
        return;
    }

    const response = await fetch(`${baseURLUtil()}/api/orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        cache: 'no-store'
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error ?? 'Failed to fetch orders.')
    }

    return data;
}