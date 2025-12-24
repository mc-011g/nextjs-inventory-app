import { RecentOrder } from "@/types"

export const RecentOrders = ({ recentOrders }: { recentOrders: RecentOrder[] }) => {

    return (
        <div className="bg-white sm:p-6 p-4 rounded h-fit overflow-auto col-span-2 border border-gray-300">
            <p className="text-gray-950 mb-2">Recent Orders</p>

            {recentOrders?.length > 0 ?
                <table className="overflow-auto w-full">
                    <thead className="">
                        <tr className="text-left">
                            <th className="py-2 pr-4">Id</th>
                            <th className="py-2 px-4">Customer Name</th>
                            <th className="py-2 px-4">Date Added</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Total Price</th>
                        </tr>
                    </thead>

                    <tbody>
                        {recentOrders.map(order =>
                            <tr key={order._id} className="border-t-1 border-gray-300 hover:bg-gray-200">
                                <td className="py-3 pr-2">
                                    {order._id}
                                </td>
                                <td className="py-3 px-2">
                                    {order.customerName}
                                </td>
                                <td className="py-3 px-2">
                                    {order.dateAdded?.toLocaleString()}
                                </td>
                                <td className="py-3 px-2">
                                    {order.status === "Pending" &&
                                        <div className="p-2 bg-yellow-400 rounded text-yellow-900 font-bold text-center w-fit">{order.status}</div>
                                    }
                                    {order.status === "Delivered" &&
                                        <div className="p-2 bg-green-300 rounded text-green-900 font-bold text-center w-fit">{order.status}</div>
                                    }
                                    {order.status === "Shipped" &&
                                        <div className="p-2 bg-blue-300 rounded text-blue-900 font-bold text-center w-fit">{order.status}</div>
                                    }
                                    {order.status === "Cancelled" &&
                                        <div className="p-2 bg-red-300 rounded text-red-900 font-bold text-center w-fit">{order.status}</div>
                                    }
                                    {order.status === "Processing" &&
                                        <div className="p-2 bg-purple-300 rounded text-purple-900 font-bold text-center w-fit">{order.status}</div>
                                    }
                                </td>

                                <td className="py-3 px-2">
                                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(order.totalPrice)}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                :
                <div>
                    <p className="text-3xl sm:text-4xl mt-2 text-gray-800 font-bold">None</p>
                </div>
            }
        </div>
    )
}