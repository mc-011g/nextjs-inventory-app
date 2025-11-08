import { Order } from "@/types";
import { baseURLUtil } from "../baseURLUtil";

export const updateOrderUtil = async (order: Order, userIdToken: string) => {

    if (!userIdToken) {
        return;
    }

    const response = await fetch(`${baseURLUtil()}/api/orders/${order._id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        body: JSON.stringify(order),
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to update order.')
    }

    return data;
}