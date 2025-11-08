import { baseURLUtil } from "../baseURLUtil";

export const deleteUserUtil = async (id: string, userIdToken: string) => {

    const response = await fetch(`${baseURLUtil}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? 'Failed to delete user.')
    }

    return data;
}