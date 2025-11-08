import { ChangeEvent, useContext, useState } from "react";
import { Modal } from "./Modal"
import { Category, Product } from "@/types";
import { updateProductUtil } from "@/util/products/updateProductUtil";
import { ToastContext } from "@/app/context/ToastContext";
import { AuthContext } from "../FirebaseAuthProvider";

export const EditProductModal = ({ closeModal, handleUpdateProductList, categories, product }: { product: Product, categories: Category[], closeModal: () => void, handleUpdateProductList: (value: Product) => void }) => {

    const [imageLink, setImageLink] = useState<string>(product.imageLink || "");
    const [name, setName] = useState<string>(product.name);
    const [price, setPrice] = useState<number>(product.price);
    const [category, setCategory] = useState<Category | null>(categories.find(category => category._id === product.categoryId) as Category);
    const [quantity, setQuantity] = useState<number>(product.quantity);
    const [sku, setSku] = useState<string>(product.sku);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const toastContext = useContext(ToastContext);

    const handleUpdateProduct = async () => {
        if (!user) {
            setError("User not authenticated");
            toastContext?.handleShowToast("error", "You must be signed in.");
            return;
        }

        if (category && category._id) {
            setIsLoading(true);
            const initialProduct: Product = { _id: product._id, imageLink, name, price, categoryId: category._id, quantity, sku, userId: "test-user-id" };

            try {
                const userIdToken = await user.getIdToken();
                const newProduct = await updateProductUtil(initialProduct, userIdToken);

                handleUpdateProductList(newProduct);
                toastContext?.handleShowToast("success", "Successfully changed product details.");
            } catch (error) {
                setError((error as Error).message ?? "Failed to update product.");
                toastContext?.handleShowToast("success", "Failed to edit product.");
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
        <Modal title="Edit Product" closeModal={closeModal}>
            <form className="flex flex-col gap-4 text-gray-600 justify-between h-full" onSubmit={e => { e.preventDefault(); handleUpdateProduct() }}>

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
                            <select className="rounded bg-gray-200 py-2 px-4" value={category?._id} onChange={e => handleChangeSelectCategory(e)} required>
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
                        Image URL
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
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    )
}