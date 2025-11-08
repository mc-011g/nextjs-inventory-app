'use client'

import { useContext, useEffect } from "react"
import { AuthContext } from "./FirebaseAuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { VerticalNavbar } from "./VerticalNavbar";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

    const authContext = useContext(AuthContext);
    const user = authContext?.user ?? null;
    const isLoading = authContext?.isLoading ?? true;
    const router = useRouter();
    const pathname = usePathname();

    const notProtectedPageCheck = (pathname.includes('/login') || pathname.includes('/register'));

    useEffect(() => {
        if (isLoading) { return; }

        if (!user && !notProtectedPageCheck) {
            router.replace('/login');
        }
    }, [isLoading, notProtectedPageCheck, router, user]);


    if (!notProtectedPageCheck && !user) {
        return null;
    }

    return (
        <>
            {!notProtectedPageCheck &&
                <VerticalNavbar />
            }
            {children}
        </>
    );
}