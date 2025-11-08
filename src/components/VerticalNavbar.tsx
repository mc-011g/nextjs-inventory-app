'use client'

import { signOut } from "firebase/auth";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "./FirebaseAuthProvider";
import { DropdownContext } from "@/app/context/DropdownContext";
import { ToastContext } from "@/app/context/ToastContext";

export const VerticalNavbar = () => {

    const authContext = useContext(AuthContext);
    const auth = authContext?.auth ?? null;

    const dropdownContext = useContext(DropdownContext);
    const dropdown = dropdownContext?.dropdown;
    const dropdownRef = dropdownContext?.dropdownRef;
    const handleShowDropdown = dropdownContext?.handleShowDropdown;
    const toastContext = useContext(ToastContext);

    const router = useRouter();

    const handleLogout = () => {
        if (auth) {
            signOut(auth).then(() => {
                router.push('/login');
            }).catch((error) => {          
                toastContext?.handleShowToast("error", error.message ?? "Failed to sign out.");
            });
        }
    }

    return (
        <nav className="absolute min-w-fit w-[200px] h-[100vh] flex flex-col gap-2 p-8 bg-gray-900 flex flex-col justify-between z-10">
            <div className="flex flex-col">

                <Link href="/" className="flex text-gray-300 hover:text-gray-50 hover:bg-gray-800 text-gray-300 p-3 rounded transition gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                    </svg>
                    <p>Dashboard</p>
                </Link>

                <Link href="/products" className="flex text-gray-300 hover:text-gray-50 hover:bg-gray-800 text-gray-300 p-3 rounded transition gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>
                    Products
                </Link>

                <Link href="/categories" className="flex text-gray-300 hover:text-gray-50 hover:bg-gray-800 text-gray-300 p-3 rounded transition gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                    </svg>
                    Categories
                </Link>

                <Link href="/orders" className="flex text-gray-300 hover:text-gray-50 hover:bg-gray-800 text-gray-300 p-3 rounded transition gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    Orders
                </Link>

            </div>

            <div className="flex justify-center">

                <div onClick={() => handleShowDropdown?.("userProfileIcon")} className="cursor-pointer relative">
                    {dropdown?.id === "userProfileIcon" &&
                        <div className="" ref={dropdownRef}>
                            <div className="flex flex-col absolute border rounded border-gray-400 bg-gray-100 z-30 bottom-full">
                                <Link href="/profile" className="text-left cursor-pointer hover:bg-gray-200 py-2 px-4">Profile</Link>
                                <div className="text-left cursor-pointer hover:bg-gray-200 py-2 px-4" onClick={() => handleLogout()}>Logout</div>
                            </div>
                        </div>
                    }

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 text-gray-300 hover:text-gray-50 transition w-fit">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </div>
            </div>
        </nav>
    )
}