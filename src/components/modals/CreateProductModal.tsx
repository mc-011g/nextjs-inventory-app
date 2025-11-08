import { ChangeEvent, useContext, useState } from "react";
import { Modal } from "./Modal"
import { createProductUtil } from "@/util/products/createProductUtil";
import { Category, Product } from "@/types";
import { ToastContext } from "@/app/context/ToastContext";
import { AuthContext } from "../FirebaseAuthProvider";

export const CreateProductModal = ({ closeModal, handleAddNewProduct, categories }: { categories: Category[], closeModal: () => void, handleAddNewProduct: (value: Product) => void }) => {

    const [imageLink, setImageLink] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [category, setCategory] = useState<Category | null>(categories[0]);
    const [quantity, setQuantity] = useState<number>(1);
    const [sku, setSku] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const toastContext = useContext(ToastContext);

    const handleCreateProduct = async () => {
        if (!user) {
            setError("User not authenticated");
            toastContext?.handleShowToast("error", "You must be signed in.");
            return;
        }

        if (category && category._id) {
            setIsLoading(true);
            const product: Product = { imageLink, name, price, categoryId: category._id, quantity, sku };

            try {
                const userIdToken = await user.getIdToken();
                const newProduct = await createProductUtil(product, userIdToken);

                handleAddNewProduct(newProduct);
                toastContext?.handleShowToast("success", "Added new product.");
            } catch (error) {
                setError((error as Error).message ?? "Failed to create product");
                toastContext?.handleShowToast("error", "Failed to create product.");
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleChangeSelectCategory = (e: ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value;
        const selectedCategory = categories.find(category => category._id === categoryId);

        if (selectedCategory) {
            setCategory(selectedCategory);
        }
    }

    return (
        <Modal title="Create Product" closeModal={closeModal}>

            <form className="flex flex-col gap-4 text-gray-600 justify-between h-full" onSubmit={e => { e.preventDefault(); handleCreateProduct() }}>

                <div className="flex flex-col gap-4">
                    <label className="flex flex-col">
                        Name
                        <input required maxLength={80} type="text" placeholder="Product Name" className="rounded bg-gray-200 py-2 px-4" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>

                    <div className="flex flex-row gap-2">
                        <label className="flex flex-col">
                            Price
                            <input maxLength={20} required type="number" placeholder="0" className="rounded bg-gray-200 py-2 px-4" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                        </label>
                        <label className="flex flex-col">
                            Quantity
                            <input maxLength={20} required type="number" className="rounded bg-gray-200 py-2 px-4" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                        </label>
                    </div>

                    <label className="flex flex-col">
                        Category
                        {categories && categories.length > 0 ?
                            <select className="rounded bg-gray-200 py-2 px-4" value={category?._id ?? ""} onChange={e => handleChangeSelectCategory(e)} required>
                                {categories.map(category =>
                                    <option className="rounded bg-gray-200 py-2 px-4" key={category._id} value={category._id}>{category.name}</option>
                                )}
                            </select>
                            :
                            <p>No categories exist.</p>
                        }
                    </label>

                    <label className="flex flex-col">
                        SKU
                        <input maxLength={20} required type="text" placeholder="APL-1" className="rounded bg-gray-200 py-2 px-4" value={sku} onChange={(e) => setSku(e.target.value)} />
                    </label>

                    <label className="flex flex-col">
                        <div className="inline-flex gap-1">
                            <span>Image URL</span>
                            <span className="text-gray-400">(optional)</span>
                        </div>
                        <input maxLength={100} type="url" placeholder="https://..." className="rounded bg-gray-200 py-2 px-4" value={imageLink} onChange={(e) => setImageLink(e.target.value)} />
                    </label>
                </div>

                {error &&
                    <div className="text-red-600">{error}</div>
                }

                <div className="flex justify-end gap-4">
                    <button type="button" className="bg-gray-300 p-2 rounded hover:bg-gray-400 hover:text-gray-700 cursor-pointer" onClick={closeModal}>
                        Cancel
                    </button>

                    <button type="submit" className="bg-green-300 p-2 rounded hover:bg-green-400 hover:text-gray-700 cursor-pointer inline-flex gap-2 items-center">
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