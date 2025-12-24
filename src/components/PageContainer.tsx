import { NavbarContext } from "@/app/context/NavbarContext";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { ReactNode, useContext } from "react";

export default function PageContainer({ title, children }: { title: string, children: ReactNode }) {

    const navbarContext = useContext(NavbarContext);

    return (
        <div className="bg-gray-100 p-4 sm:p-6 flex w-full flex-col w-[calc(100%-192px)] overflow-auto">

            <div className="flex flex-row justify-between items-center pb-8 gap-4">
                <h1 className="text-gray-950 text-4xl sm:text-5xl font-bold">{title}</h1>

                <button type="button" className="md:hidden cursor-pointer h-fit w-fit" onClick={() => navbarContext.setShowNavbar((prev) => !prev)}>
                    <Bars3Icon className="size-8 sm:size-12" />
                </button>
            </div>

            <main className="flex flex-wrap gap-4 flex-1">
                {children}
            </main>
        </div>
    );
}
