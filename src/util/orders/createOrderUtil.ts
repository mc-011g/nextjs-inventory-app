import { Order } from "@/types";
import { baseURLUtil } from "../baseURLUtil";

export const createOrderUtil = async (order: Order, userIdToken: string) => {

    if (!userIdToken) {
        return;
    }

    const response = await fetch(`${baseURLUtil()}/api/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        body: JSON.stringify(order),
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? 'Failed to create order.')
    }

    return data;
}