'use client'

import { getTotalSalesUtil } from "@/util/metrics/getTotalSalesUtil";
import DashboardPage from "../components/pages/DashboardPage";
import { getTotalUniqueProductsUtil } from "@/util/metrics/getTotalUniqueProductsUtil";
import { getTopCategorySalesUtil } from "@/util/metrics/getTopCategorySales";
import { getTotalStockUtil } from "@/util/metrics/getTotalStockUtil";
import { getLowStockProductsUtil } from "@/util/metrics/getLowStockProductsUtil";
import { getRecentOrdersUtil } from "@/util/metrics/getRecentOrdersUtil";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/FirebaseAuthProvider";
import { LowStockProduct, RecentOrder, TopCategorySale } from "@/types";
import { ToastContext } from "./context/ToastContext";

export default function Home() {

  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const authIsLoading = authContext?.isLoading ?? true;
  const toastContext = useContext(ToastContext);

  const [metricsLoading, setMetricsLoading] = useState<boolean>(true);

  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalStock, setTotalStock] = useState<number>(0);
  const [totalUniqueProducts, setTotalUniqueProducts] = useState<number>(0);
  const [topCategorySales, setTopCategorySales] = useState<TopCategorySale[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    if (user && !authIsLoading) {
      const getMetrics = async () => {

        try {
          const userIdToken = await user.getIdToken();

          const totalSales = await getTotalSalesUtil(userIdToken);
          setTotalSales(totalSales ?? 0);

          const totalStock = await getTotalStockUtil(userIdToken); //not complete
          setTotalStock(totalStock ?? 0);

          const totalUniqueProducts = await getTotalUniqueProductsUtil(userIdToken);//not complete
          setTotalUniqueProducts(totalUniqueProducts ?? []);

          const topCategorySales = await getTopCategorySalesUtil(userIdToken);
          setTopCategorySales(topCategorySales as TopCategorySale[]);

          const lowStockProducts = await getLowStockProductsUtil(userIdToken);
          setLowStockProducts(lowStockProducts ?? []);

          const recentOrders = await getRecentOrdersUtil(userIdToken);
          setRecentOrders(recentOrders as RecentOrder[]);

        } catch (error) {
          toastContext?.handleShowToast("error", (error as string) ?? "Failed to get metrics.");
        } finally {
          setMetricsLoading(false);
        }
      }
      getMetrics();
    }
  }, [authIsLoading, toastContext, user]);

  return (
    <>
      {!metricsLoading &&
        <DashboardPage
          totalSales={totalSales}
          totalStock={totalStock}
          totalUniqueProducts={totalUniqueProducts}
          topCategorySales={topCategorySales}
          lowStockProducts={lowStockProducts}
          recentOrders={recentOrders}
        />
      }
    </>

  );
}
