'use client'

import { AuthContext } from "@/components/FirebaseAuthProvider";
import { CategoriesPage } from "@/components/pages/CategoriesPage";
import { Category } from "@/types";
import { getCategoriesUtil } from "@/util/categories/getCategoriesUtil";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "../context/ToastContext";

export default function Categories() {

    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const authIsLoading = authContext?.isLoading ?? true;

    const [initialCategories, setInitialCategories] = useState<Category[] | []>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const toastContext = useContext(ToastContext);

    useEffect(() => {
        if (user && !authIsLoading) {
            const getInitialData = async () => {
                try {
                    const userIdToken = await user.getIdToken();
                    const initialCategoriesData = await getCategoriesUtil(userIdToken);
                    setInitialCategories(initialCategoriesData);
                } catch (error) {
                    toastContext?.handleShowToast("error", (error as Error).message ?? " Failed to load data.");
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
                <CategoriesPage initialCategories={initialCategories} />
            }
        </>
    );
}