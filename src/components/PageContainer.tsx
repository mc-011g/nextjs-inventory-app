import { ReactNode } from "react";

export default function PageContainer({ title, children }: { title: string, children: ReactNode }) {
   
    return (
        <div className="bg-gray-300 ml-[200px] p-8 flex flex-col h-[100vh]">
            <h1 className="text-gray-600 text-3xl pb-8">{title}</h1>
            <main className="flex flex-wrap gap-4 flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
}
