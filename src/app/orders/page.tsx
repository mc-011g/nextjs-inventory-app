'use client'

import { AuthContext } from "@/components/FirebaseAuthProvider";
import { OrdersPage } from "@/components/pages/OrdersPage";
import { Order, Product } from "@/types";
import { getOrdersUtil } from "@/util/orders/getOrdersUtil";
import { getProductsUtil } from "@/util/products/getProductsUtil";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "../context/ToastContext";

export default function Orders() {

    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const authIsLoading = authContext?.isLoading ?? true;

    const [initialProducts, setInitialProducts] = useState<Product[] | []>([]);
    const [initialOrders, setInitialOrders] = useState<Order[] | []>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const toastContext = useContext(ToastContext);

    useEffect(() => {
        if (user && !authIsLoading) {
            const getInitialData = async () => {
                try {
                    const userIdToken = await user.getIdToken();                    
                    const initialProductsData = await getProductsUtil(userIdToken);                    
                    setInitialProducts(initialProductsData);

                    const initialOrdersData = await getOrdersUtil(userIdToken);    
                    setInitialOrders(initialOrdersData);
                } catch (error) {         
                    toastContext?.handleShowToast("error", (error as Error).message ?? "Failed to load orders data.");
                } finally {
                    setLoading(false);
                }
            }
            getInitialData();
        }
    }, [authIsLoading, toastContext, user]);

    return (
        <>
            {!loading &&
                <OrdersPage initialOrders={initialOrders} products={initialProducts} />
            }
        </>
    );
}