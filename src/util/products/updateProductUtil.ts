import { Product } from "@/types";
import { baseURLUtil } from "../baseURLUtil";

export const updateProductUtil = async (product: Product, userIdToken: string) => {

    if (!userIdToken) {
        return;
    }

    const response = await fetch(`${baseURLUtil()}/api/products/${product._id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        body: JSON.stringify(product),
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? 'Failed to update product.')
    }

    return data;
}