import { Category } from "@/types";
import { baseURLUtil } from "../baseURLUtil";

export const updateCategoryUtil = async (category: Category, userIdToken: string) => {

    if (!userIdToken) {
        return;
    }

    const response = await fetch(`${baseURLUtil()}/api/categories/${category._id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        body: JSON.stringify(category),
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to update category.')
    }

    return data;
}