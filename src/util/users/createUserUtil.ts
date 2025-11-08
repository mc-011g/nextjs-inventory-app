import { User } from "@/types";
import { baseURLUtil } from "../baseURLUtil";

export const createUserUtil = async (user: User) => {

    const response = await fetch(`${baseURLUtil()}/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? 'Failed to create user.')
    }

    return data;
}