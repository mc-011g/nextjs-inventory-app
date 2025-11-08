import { baseURLUtil } from "../baseURLUtil";

export const getCategoriesUtil = async (userIdToken: string) => {

    if (!userIdToken) {
        return;
    }  
 
    const response = await fetch(`${baseURLUtil()}/api/categories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch categories.')
    }

    return data;
}