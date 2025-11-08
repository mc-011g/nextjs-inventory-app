import { baseURLUtil } from "../baseURLUtil";

export const updateProfileNamesUtil = async (firstName: string, lastName: string, userIdToken: string) => {

    if (!userIdToken) {
        return;
    }

    const response = await fetch(`${baseURLUtil()}/api/profile`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        body: JSON.stringify({ firstName, lastName }),
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? 'Failed to create product.')
    }

    return data;
}