import { LowStockProduct, RecentOrder, TopCategorySale } from "@/types";
import { LowStockProducts } from "../metrics/LowStockProducts";
import { RecentOrders } from "../metrics/RecentOrders";
import { TopCategorySales } from "../metrics/TopCategorySales";
import PageContainer from "../PageContainer";

export default function DashboardPage(
  {
    totalSales,
    totalStock,
    totalUniqueProducts,
    topCategorySales,
    lowStockProducts,
    recentOrders
  }: {
    totalSales: number,
    totalStock: number,
    totalUniqueProducts: number,
    topCategorySales: TopCategorySale[],
    lowStockProducts: LowStockProduct[],
    recentOrders: RecentOrder[],
  }) {

  return (

    <PageContainer title="Dashboard">

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 w-full h-fit border-gray-300">
        <div className="bg-white p-3 rounded h-fit p-4 sm:p-6 border border-gray-300">
          <p className="text-gray-800">Total Sales</p>
          <p className="text-3xl sm:text-4xl mt-2 text-gray-800 font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalSales)}</p>
        </div>

        <div className="bg-white p-3 rounded h-fit p-4 sm:p-6 border border-gray-300">
          <p className="text-gray-800">Total Unique Products</p>
          <p className="text-3xl sm:text-4xl mt-2 text-gray-800 font-bold">{totalUniqueProducts}</p>
        </div>

        <div className="bg-white p-3 rounded h-fit p-4 sm:p-6 border border-gray-300">
          <p className="text-gray-800">Total Stock</p>
          <p className="text-3xl sm:text-4xl mt-2 text-gray-800 font-bold">{totalStock}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
        <TopCategorySales topCategorySales={topCategorySales} />
        <LowStockProducts lowStockProducts={lowStockProducts} />
        <RecentOrders recentOrders={recentOrders} />
      </div>

    </PageContainer>
  );
}
