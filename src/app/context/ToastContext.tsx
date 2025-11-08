'use client'

import { Toast } from "@/components/Toast";
import { createContext, useState } from "react";

interface Toast {
    type: string,
    message: string,
}

interface ToastContextType {
    handleShowToast: (type: string, message: string) => void,
    handleCloseToast: () => void,
}

export const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {

    const [toast, setToast] = useState<Toast | null>(null);

    const handleShowToast = (type: string, message: string) => {
        setToast({ type, message });

        setTimeout(() => {
            setToast(null);
        }, 5000);
    }

    const handleCloseToast = () => {
        setToast(null);
    }

    return (
        <ToastContext.Provider value={{ handleShowToast, handleCloseToast }} >
            {children}

            {toast &&
                <Toast message={toast.message} type={toast.type} />
            }
        </ToastContext.Provider >
    )
}