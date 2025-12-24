import { useContext, useState } from "react";
import { Modal } from "./Modal"
import { deleteProductUtil } from "@/util/products/deleteProductUtil";
import { ToastContext } from "@/app/context/ToastContext";
import { AuthContext } from "../FirebaseAuthProvider";

export const DeleteProductModal = ({ closeModal, handleRemoveProduct, productId, productName }: { productId: string, productName: string, closeModal: () => void, handleRemoveProduct: (value: string) => void }) => {

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const toastContext = useContext(ToastContext);

    const handleDeleteProduct = async () => {
        if (!user) {
            setError("User not authenticated");
            toastContext?.handleShowToast("error", "You must be signed in.");
            return;
        }

        setIsLoading(true);
        try {
            const userIdToken = await user.getIdToken();
            await deleteProductUtil(productId, userIdToken);

            handleRemoveProduct(productId);
            toastContext?.handleShowToast("success", "Deleted product.");
        } catch (error) {
            setError((error as Error).message ?? "Failed to delete product.");
            toastContext?.handleShowToast("error", "Failed to delete product.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal title="Delete Product" closeModal={closeModal}>
            <form className="flex flex-col gap-4 text-gray-950 justify-between h-full" onSubmit={e => { e.preventDefault(); handleDeleteProduct() }}>

                <p>Are you sure you want to delete <span className="font-bold">{productName}?</span></p>

                {error &&
                    <div className="text-red-600">{error}</div>
                }

                <div className="flex justify-end gap-4 sm:flex-row flex-col mt-4">
                    <button type="button" className="bg-gray-300 text-gray-950 p-2 rounded hover:bg-gray-200 cursor-pointer transition" onClick={closeModal}>
                        Cancel
                    </button>
                    <button type="submit" className="bg-red-800 p-2 rounded hover:bg-red-700 text-red-50 cursor-pointer inline-flex gap-2 items-center transition" disabled={isLoading}>
                        {isLoading &&
                            <div className="min-w-4 min-h-4 animate-spin
                         border-l-2 border-b-2 border-r-2 border-r-red-50 border-t-red-50 border-t-2
                          rounded-full border-l-red-300/50 border-t-red-50 border-b-red-300/50"></div>
                        }
                        <span className="w-full">Delete</span>
                    </button>
                </div>
            </form>
        </Modal>
    )
}