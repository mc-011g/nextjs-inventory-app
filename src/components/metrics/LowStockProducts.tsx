import { LowStockProduct } from "@/types"

export const LowStockProducts = ({ lowStockProducts }: { lowStockProducts: LowStockProduct[] }) => {

    return (
        <div className="bg-white p-4 rounded sm:p-6 border border-gray-300 col-span-2 sm:col-span-1 ">
            <p className="text-gray-950 mb-2">Low Stock Products</p>

            {lowStockProducts?.length > 0 ?
                <table className="w-full overflow-auto">
                    <thead>
                        <tr className="text-left">
                            <th className="pr-4">Name</th>
                            <th className="py-3 px-2">Quantity</th>
                            <th className="py-3 px-2">Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowStockProducts.map(lowStockProduct =>
                            <tr key={lowStockProduct._id} className="border-t-1 border-gray-300 hover:bg-gray-200">
                                <td className="py-3 pr-2">
                                    <p>{lowStockProduct.name}</p>
                                </td>
                                <td className="py-3 px-2">
                                    <p>{lowStockProduct.quantity}</p>
                                </td>
                                <td className="py-3 px-2">
                                    <p>{lowStockProduct.categoryName}</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                :
                <p className="text-3xl sm:text-4xl mt-2 text-gray-800 font-bold">None</p>
            }
        </div>
    )
}