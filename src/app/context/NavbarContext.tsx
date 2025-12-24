'use client'

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface NavbarContextType {
    showNavbar: boolean,
    setShowNavbar: Dispatch<SetStateAction<boolean>>
}

export const NavbarContext = createContext<NavbarContextType>({
    showNavbar: true,
    setShowNavbar: (value: SetStateAction<boolean>) => { }
});

export const NavbarProvider = ({ children }: { children: ReactNode }) => {

    const [showNavbar, setShowNavbar] = useState<boolean>(false); 

    return <NavbarContext.Provider value={{ showNavbar, setShowNavbar }}>
        {children}
    </NavbarContext.Provider>
}