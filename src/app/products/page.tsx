'use client'

import { AuthContext } from "@/components/FirebaseAuthProvider";
import { ProductsPage } from "@/components/pages/ProductsPage";
import { Category, Product } from "@/types";
import { getCategoriesUtil } from "@/util/categories/getCategoriesUtil";
import { getProductsUtil } from "@/util/products/getProductsUtil";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "../context/ToastContext";

export default function Products() {

    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const authIsLoading = authContext?.isLoading ?? true;

    const [initialProducts, setInitialProducts] = useState<Product[] | []>([]);
    const [categories, setCategories] = useState<Category[] | []>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const toastContext = useContext(ToastContext);

    useEffect(() => {
        if (user && !authIsLoading) {
            const getInitialData = async () => {
                try {
                    const userIdToken = await user.getIdToken();

                    const initialProductsData: Product[] = await getProductsUtil(userIdToken);
                    const initialCategoriesData: Category[] = await getCategoriesUtil(userIdToken);

                    if (initialProductsData && initialCategoriesData) {
                        setCategories(initialCategoriesData);

                        const initialProductsWithCategoryName = initialProductsData.map(product => { return { ...product, categoryName: initialCategoriesData.find(category => category._id === product.categoryId)?.name } });
                        setInitialProducts(initialProductsWithCategoryName);
                    }
                } catch (error) {           
                    toastContext?.handleShowToast("error", (error as Error).message ?? " Failed to load products data.");
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
                <ProductsPage initialProducts={initialProducts} categories={categories} />
            }
        </>
    );
}