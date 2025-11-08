import { ToastContext } from "@/app/context/ToastContext";
import { useContext } from "react"

export const Toast = ({ message, type }: { message: string, type: string }) => {

    const toastContext = useContext(ToastContext);

    const handleClose = () => {
        toastContext?.handleCloseToast();
    }

    return (
        <div className={`
           ${type === "success" &&
            'bg-green-600 text-green-50'
            }
           
            ${type === "error" &&
            'bg-red-600 text-red-50'
            }
           
            ${type === "warning" &&
            'bg-yellow-600 text-yellow-50'
            }
            
            ${type === "info" &&
            'bg-gray-50 text-gray-800'
            }

        fixed z-100 bottom-[1.5rem] left-[50%] -translate-x-1/2 p-3 rounded shadow-md inline-flex gap-8 justify-self-center
        `}>
            <div className="inline-flex gap-2">
                {type === "success" &&
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-green-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                }
                {type === "error" &&
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                }
                {type === "warning" &&
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-yellow-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                }
                {type === "info" &&
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-800">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                }

                {message}
            </div>

            <button className="hover:cursor-pointer" onClick={() => handleClose()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6  ${type === "info" ? "text-gray-800/50" : "text-gray-50/60"} `}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>

        </div>
    )
}