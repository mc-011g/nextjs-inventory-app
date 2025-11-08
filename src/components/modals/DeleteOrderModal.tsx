import { deleteOrderUtil } from "@/util/orders/deleteOrderUtil";
import { Modal } from "./Modal"
import { useContext, useState } from "react";
import { ToastContext } from "@/app/context/ToastContext";
import { AuthContext } from "../FirebaseAuthProvider";


export const DeleteOrderModal = ({ closeModal, handleRemoveOrder, orderId }: { orderId: string, closeModal: () => void, handleRemoveOrder: (value: string) => void }) => {

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const toastContext = useContext(ToastContext);

    const handleDeleteOrder = async () => {
        if (!user) {
            setError("User not authenticated");
            toastContext?.handleShowToast("error", "You must be signed in.");
            return;
        }

        setIsLoading(true);
        try {
            const userIdToken = await user.getIdToken();
            await deleteOrderUtil(orderId, userIdToken);

            handleRemoveOrder(orderId);
            toastContext?.handleShowToast("success", "Deleted order.");
        } catch (error) {
            setError((error as Error).message ?? "Failed to delete order.");
            toastContext?.handleShowToast("error", "Failed to delete order.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal title="Delete Order" closeModal={closeModal}>
            <form className="flex flex-col gap-4 text-gray-600 justify-between h-full" onSubmit={e => { e.preventDefault(); handleDeleteOrder() }}>

                <p>Are you sure you want to delete order <span className="font-bold">{orderId}?</span></p>

                {error &&
                    <div className="text-red-600">{error}</div>
                }

                <div className="flex justify-end gap-4">
                    <button type="button" className="bg-gray-300 p-2 rounded hover:bg-gray-400 hover:text-gray-700 cursor-pointer" onClick={closeModal}>
                        Cancel
                    </button>

                    <button type="submit" className="bg-red-300 p-2 rounded hover:bg-red-400 hover:text-gray-700 cursor-pointer inline-flex gap-2 items-center">
                        {isLoading &&
                            <div className=" size-5 animate-spin
                         border-l-2 border-b-2 border-r-2 border-r-red-50 border-t-red-50 border-t-2
                          rounded-full border-l-red-300 border-t-red-50 border-b-red-300/50"></div>
                        }
                        Delete
                    </button>

                </div>
            </form>
        </Modal>
    )
}