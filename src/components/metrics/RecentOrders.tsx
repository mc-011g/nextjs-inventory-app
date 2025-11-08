import { RecentOrder } from "@/types"

export const RecentOrders = ({ recentOrders }: { recentOrders: RecentOrder[] }) => {

    return (
        <div className="bg-gray-200 p-3 rounded h-fit">
            <p className="text-gray-600 mb-2">Recent Orders</p>

            {recentOrders?.length > 0 ?
                <table>
                    <thead className="text-gray-600">
                        <tr className="text-left">
                            <th className="pl-2">Id</th>
                            <th className="py-2 px-4">Customer Name</th>
                            <th className="py-2 px-4">Date Added</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Total Price</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {recentOrders.map(order =>
                            <tr key={order._id} className="border-t-1 border-gray-300 hover:bg-gray-200">
                                <td className="p-2">
                                    {order._id}
                                </td>
                                <td className="px-4">
                                    {order.customerName}
                                </td>
                                <td className="px-4">
                                    {order.dateAdded?.toLocaleString()}
                                </td>
                                <td className="px-4">
                                    {order.status}
                                </td>
                                <td className="px-4">
                                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(order.totalPrice)}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                :
                <div>
                    <p className="text-3xl mt-2 text-gray-800 font-bold">None</p>
                </div>
            }
        </div>
    )
}