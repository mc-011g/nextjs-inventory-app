import { User } from "@/types";
import { baseURLUtil } from "../baseURLUtil";

export const updateUserUtil = async (user: User, userIdToken: string) => {

    const response = await fetch(`${baseURLUtil()}/api/users`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        body: JSON.stringify(user),
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? 'Failed to create user.');
    }

    return data;
}