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

      <div className="flex flex-wrap gap-4 grow">
        <div className="bg-gray-200 p-3 rounded h-fit grow">
          <p className="text-gray-600">Total Sales</p>
          <p className="text-3xl mt-2 text-gray-800 font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalSales)}</p>
        </div>
        <div className="bg-gray-200 p-3 rounded h-fit grow">
          <p className="text-gray-600">Total Unique Products</p>
          <p className="text-3xl mt-2 text-gray-800 font-bold">{totalUniqueProducts}</p>
        </div>
        <div className="bg-gray-200 p-3 rounded h-fit grow">
          <p className="text-gray-600">Total Stock</p>
          <p className="text-3xl mt-2 text-gray-800 font-bold">{totalStock}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 grow">
        <TopCategorySales topCategorySales={topCategorySales} />
        <LowStockProducts lowStockProducts={lowStockProducts} />
        <RecentOrders recentOrders={recentOrders} />
      </div>

    </PageContainer>
  );
}
