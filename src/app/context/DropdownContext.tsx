'use client'

import { createContext, RefObject, useEffect, useRef, useState } from "react";

interface DropdownContextType {
    dropdownRef: RefObject<HTMLDivElement | null>,
    handleShowDropdown: (id: string) => void,
    dropdown: { id: string } | null,
    handleCloseDropdown: () => void
}

export const DropdownContext = createContext<DropdownContextType | null>(null);

export const DropdownProvider = ({ children }: { children: React.ReactNode }) => {

    const [dropdown, setDropdown] = useState<{ id: string } | null>(null);

    const handleShowDropdown = (id: string) => {
        if (!dropdown) {
            setDropdown({ id });
        } else {
            setDropdown(null);
        }
    }

    const handleCloseDropdown = () => {
        setDropdown(null);
    }

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutsideDropdown = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setDropdown(null);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideDropdown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideDropdown);
        }
    }, []);

    return (
        <DropdownContext.Provider value={{ dropdownRef, handleShowDropdown, dropdown, handleCloseDropdown }} >
            {children}
        </DropdownContext.Provider >
    )
}