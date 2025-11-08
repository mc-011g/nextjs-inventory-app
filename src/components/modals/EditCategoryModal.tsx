import { useContext, useState } from "react";
import { Modal } from "./Modal"
import { Category } from "@/types";
import { updateCategoryUtil } from "@/util/categories/updateCategoryUtil";
import { ToastContext } from "@/app/context/ToastContext";
import { AuthContext } from "../FirebaseAuthProvider";

export const EditCategoryModal = ({ closeModal, handleUpdateCategory, category }: { category: Category, closeModal: () => void, handleUpdateCategory: (value: Category) => void }) => {

    const [description, setDescription] = useState<string>(category.description);
    const [name, setName] = useState<string>(category.name);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const toastContext = useContext(ToastContext);

    const handleEditCategory = async () => {
        if (!user) {
            setError("User not authenticated");
            toastContext?.handleShowToast("error", "You must be signed in.");
            return;
        }

        setIsLoading(true);
        const newCategory: Category = { _id: category._id, name, description };

        try {
            const userIdToken = await user.getIdToken();
            const updatedCategory = await updateCategoryUtil(newCategory, userIdToken);

            handleUpdateCategory(updatedCategory);
            toastContext?.handleShowToast("success", "Successfully changed category details.");
        } catch (error) {
            setError((error as Error).message ?? "Failed to update category.");
            toastContext?.handleShowToast("success", "Failed to edit category.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal title="Edit Category" closeModal={closeModal}>
            <form className="flex flex-col gap-4 text-gray-600 justify-between h-full" onSubmit={e => { e.preventDefault(); handleEditCategory() }}>

                <div className="flex flex-col gap-2">

                    <label className="flex flex-col">
                        Name
                        <input required maxLength={80} type="text" placeholder="Product Name" className="rounded bg-gray-200 py-2 px-4" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>

                    <label className="flex flex-col">
                        Description
                        <textarea required maxLength={80} rows={6} placeholder="Category description" className="rounded bg-gray-200 py-2 px-4 resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </label>
                </div>

                {error &&
                    <div className="text-red-600">{error}</div>
                }

                <div className="flex justify-end gap-4">
                    <button type="button" className="bg-gray-300 p-2 rounded hover:bg-gray-400 hover:text-gray-700 cursor-pointer transition" onClick={closeModal}>
                        Cancel
                    </button>

                    <button type="submit" disabled={isLoading} className="bg-green-300 p-2 rounded hover:bg-green-400 hover:text-gray-700 cursor-pointer inline-flex gap-2 items-center">
                        {isLoading &&
                            <div className=" size-5 animate-spin
                         border-l-2 border-b-2 border-r-2 border-r-green-50 border-t-green-50 border-t-2
                          rounded-full border-l-green-300 border-t-green-50 border-b-green-300/50"></div>
                        }
                        Save
                    </button>

                </div>
            </form>
        </Modal>
    )
}