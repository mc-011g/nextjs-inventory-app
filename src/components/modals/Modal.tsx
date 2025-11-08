import { ReactNode } from "react"

export const Modal = ({ title, children, closeModal }: { title: string, children: ReactNode, closeModal: () => void }) => {

    return (
        <div className="absolute w-screen h-screen bg-gray-800/50 top-0 left-0 flex items-center justify-center z-12">
            <div className="bg-gray-50 rounded w-[512px] p-8 flex flex-col gap-4 max-h-[calc(100%-4rem)] overflow-hidden">

                <div className="flex flex-row justify-between items-center text-gray-600">
                    <h2 className="text-2xl">{title}</h2>
                    <button className="cursor-pointer" onClick={closeModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="grow overflow-auto pr-6">
                    {children}
                </div>
            </div>
        </div>
    )
}