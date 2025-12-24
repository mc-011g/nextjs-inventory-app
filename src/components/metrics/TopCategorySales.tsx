import { TopCategorySale } from "@/types"

export const TopCategorySales = ({ topCategorySales }: { topCategorySales: TopCategorySale[] }) => {

    const salesNumbers = topCategorySales.map(category => category.totalSales);
    const largestSale = Math.max(...salesNumbers);
    const maxChartHeight = Math.ceil(largestSale * 0.2 + largestSale);

    return (
        <div className={`${topCategorySales.length > 0 && 'pb-10'} col-span-2 sm:col-span-1 bg-white rounded h-full overflow-x-auto p-4 sm:p-6 border border-gray-300`}>
            <p className="text-gray-950 mb-2">Top Category Sales</p>

            {topCategorySales?.length > 0 ?
                <div className="flex flex-row gap-10 w-full pt-4" style={{ height: '350px' }}>
                    <div className="flex flex-col mr-8">

                        <div className="h-[20%] w-[20%] relative">
                            <div className="absolute -top-[10px] flex flex-row w-12 items-center">
                                {maxChartHeight.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                                <span className="ml-1 absolute -top-[3px] -right-3">-</span>
                            </div>
                        </div>

                        <div className="h-[20%] relative">
                            <div className="absolute -top-[10px] flex flex-row w-12 items-center">
                                {(maxChartHeight * 0.8).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                                <span className="ml-1 absolute -top-[3px] -right-3">-</span>
                            </div>
                        </div>

                        <div className="h-[20%] relative">
                            <div className="absolute -top-[10px] flex flex-row w-12 items-center">
                                {(maxChartHeight * 0.6).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                                <span className="ml-1 absolute -top-[3px] -right-3">-</span>
                            </div>
                        </div>

                        <div className="h-[20%] relative">
                            <div className="absolute -top-[10px] flex flex-row w-12 items-center">
                                {(maxChartHeight * 0.4).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                                <span className="ml-1 absolute -top-[3px] -right-3">-</span>
                            </div>
                        </div>

                        <div className="h-[20%] relative">
                            <div className="absolute -top-[10px] flex flex-row w-12 items-center">
                                {(maxChartHeight * 0.2).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                                <span className="ml-1 absolute -top-[3px] -right-3">-</span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -top-[10px] flex flex-row w-12 items-center">
                                {0}
                                <span className="ml-1 absolute -top-[3px] -right-3">-</span>
                            </div>
                        </div>
                    </div>

                    {topCategorySales?.map((category, index) =>
                        <div key={category._id} className="flex flex-col justify-end relative">
                            <div
                                className={`w-24 rounded-[4px]
                            ${index === 0 && 'bg-green-700'}
                                ${index === 1 && 'bg-purple-700'}
                                       ${index === 2 && 'bg-blue-700'}
                                              ${index === 3 && 'bg-yellow-700'}
                                                     ${index === 4 && 'bg-orange-700'}
                            `}
                                style={{ maxHeight: '100%', height: `${((category.totalSales / maxChartHeight) * 100)}%` }}>
                            </div>
                            <div className="absolute -bottom-8 w-24 truncate text-center">{category.categoryName}</div>
                        </div>
                    )}
                </div>
                :
                <p className="text-4xl mt-2 text-gray-800 font-bold">None</p>
            }
        </div>
    )
}