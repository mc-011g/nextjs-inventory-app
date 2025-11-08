import { LowStockProduct } from "@/types"

export const LowStockProducts = ({ lowStockProducts }: { lowStockProducts: LowStockProduct[] }) => {

    return (
        <div className="bg-gray-200 p-3 rounded h-fit ">
            <p className="text-gray-600 mb-2">Low Stock Products</p>

            {lowStockProducts?.length > 0 ?
                <table>
                    <thead className="text-gray-600">
                        <tr className="text-left">
                            <th className="pl-2">Name</th>
                            <th className="py-2 px-4">Quantity</th>
                            <th className="py-2 px-4">Category</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {lowStockProducts.map(lowStockProduct =>
                            <tr key={lowStockProduct._id} className="border-t-1 border-gray-300 hover:bg-gray-200">
                                <td className="p-2">
                                    <p>{lowStockProduct.name}</p>
                                </td>
                                <td className="px-4">
                                    <p>{lowStockProduct.quantity}</p>
                                </td>
                                <td className="px-4">
                                    <p>{lowStockProduct.categoryName}</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                :
                <p className="text-3xl mt-2 text-gray-800 font-bold">None</p>
            }
        </div>
    )
}