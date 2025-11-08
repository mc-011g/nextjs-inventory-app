import { useContext, useState } from "react";
import { Modal } from "./Modal"
import { Category } from "@/types";
import { createCategoryUtil } from "@/util/categories/createCategoryUtil";
import { ToastContext } from "@/app/context/ToastContext";
import { AuthContext } from "../FirebaseAuthProvider";

export const CreateCategoryModal = ({ closeModal, handleAddNewCategory }: { closeModal: () => void, handleAddNewCategory: (value: Category) => void }) => {

    const [description, setDescription] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const toastContext = useContext(ToastContext);

    const handleCreateCategory = async () => {
        if (!user) {
            setError("User not authenticated");
            toastContext?.handleShowToast("error", "You must be signed in.");
            return;
        }

        setIsLoading(true);
        const category: Category = { name, description };

        try {
            const userIdToken = await user.getIdToken();
            const newCategory = await createCategoryUtil(category, userIdToken);
         
            handleAddNewCategory(newCategory);
            toastContext?.handleShowToast("success", "Created category.");
        } catch (error) {
            setError((error as Error).message ?? "Failed to create category");
            toastContext?.handleShowToast("error", "Failed to create category.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal title="Create Category" closeModal={closeModal}>
            <form className="flex flex-col gap-4 text-gray-600 justify-between h-full" onSubmit={e => { e.preventDefault(); handleCreateCategory() }}>

                <div className="flex flex-col gap-2">
                    <label className="flex flex-col">
                        Name
                        <input required maxLength={80} type="text" placeholder="Category name" className="rounded bg-gray-200 py-2 px-4" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label className="flex flex-col">
                        Description
                        <input required maxLength={80} type="text" placeholder="Category description" className="rounded bg-gray-200 py-2 px-4" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </label>
                </div>

                {error &&
                    <div className="text-red-600">{error}</div>
                }

                <div className="flex justify-end gap-4">
                    <button type="button" className="bg-gray-300 p-2 rounded hover:bg-gray-400 hover:text-gray-700 cursor-pointer" onClick={closeModal}>
                        Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className="bg-green-300 p-2 rounded hover:bg-green-400 hover:text-gray-700 cursor-pointer inline-flex gap-2 items-center">
                        {isLoading &&
                            <div className=" size-5 animate-spin
                         border-l-2 border-b-2 border-r-2 border-r-green-50 border-t-green-50 border-t-2
                          rounded-full border-l-green-300 border-t-green-50 border-b-green-300/50"></div>
                        }
                        Create
                    </button>
                </div>
            </form>
        </Modal>
    )
}