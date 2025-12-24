import { deleteCategoryUtil } from "@/util/categories/deleteCategoryUtil";
import { Modal } from "./Modal"
import { useContext, useState } from "react";
import { ToastContext } from "@/app/context/ToastContext";
import { AuthContext } from "../FirebaseAuthProvider";

export const DeleteCategoryModal = ({ closeModal, handleRemoveCategory, categoryId, categoryName }: { categoryId: string, categoryName: string, closeModal: () => void, handleRemoveCategory: (value: string) => void }) => {

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const toastContext = useContext(ToastContext);

    const handleDeleteCategory = async () => {
        if (!user) {
            setError("User not authenticated");
            toastContext?.handleShowToast("error", "You must be signed in.");
            return;
        }

        setIsLoading(true);
        try {
            const userIdToken = await user.getIdToken();
            await deleteCategoryUtil(categoryId, userIdToken);

            handleRemoveCategory(categoryId);
            toastContext?.handleShowToast("success", "Deleted category.");
        } catch (error) {
            setError((error as Error).message ?? "Failed to delete category.");
            toastContext?.handleShowToast("error", "Failed to delete category.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal title="Delete Category" closeModal={closeModal}>
            <form className="flex flex-col gap-4 text-gray-950 justify-between h-full" onSubmit={e => { e.preventDefault(); handleDeleteCategory() }}>

                <p>Are you sure you want to delete <span className="font-bold">{categoryName}?</span></p>

                {error &&
                    <div className="text-red-600">{error}</div>
                }

                <div className="flex justify-end gap-4 mt-4 flex-col sm:flex-row">
                    <button type="button" className="bg-gray-300 p-2 rounded hover:bg-gray-200 cursor-pointer transition" onClick={closeModal}>
                        Cancel
                    </button>

                    <button type="submit" disabled={isLoading} className="bg-red-800 p-2 text-red-50 rounded hover:bg-red-700 cursor-pointer inline-flex gap-2 items-center transition">
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