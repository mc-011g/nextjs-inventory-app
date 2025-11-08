import { baseURLUtil } from "../baseURLUtil";

export const deleteOrderUtil = async (id: string, userIdToken: string) => {

    if (!userIdToken) {
        return;
    }

    const response = await fetch(`${baseURLUtil()}/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? 'Failed to delete order.')
    }

    return data;
}