import { Category } from "@/types";
import { baseURLUtil } from "../baseURLUtil";

export const createCategoryUtil = async (category: Category, userIdToken: string) => {

    if (!userIdToken) {
        return;
    }

    const response = await fetch(`${baseURLUtil()}/api/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        body: JSON.stringify(category),
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? 'Failed to create category.')
    }

    return data;
}