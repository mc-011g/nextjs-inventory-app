import { baseURLUtil } from "../baseURLUtil";

export const getTotalStockUtil = async (userIdToken: string) => {

    if (!userIdToken) {
        return;
    }

    const response = await fetch(`${baseURLUtil()}/api/metrics/total-stock`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userIdToken}`,
        },
        cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? "Failed to get total stock.");
    }

    const dataValue = Number(data?.totalStock ?? 0);
    const totalStock = Number.isFinite(dataValue) ? dataValue : 0;

    return totalStock;
}