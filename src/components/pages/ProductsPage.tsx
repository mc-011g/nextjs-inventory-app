'use client'

import Image from "next/image"
import { Category, Product } from "@/types"
import { useContext, useState } from "react"
import PageContainer from "../PageContainer"
import { CreateProductModal } from "../modals/CreateProductModal"
import { EditProductModal } from "../modals/EditProductModal"
import Link from "next/link"
import { DeleteProductModal } from "../modals/DeleteProductModal"
import { DropdownContext } from "@/app/context/DropdownContext"

export const ProductsPage = ({ initialProducts, categories }: { categories: Category[], initialProducts: Product[] }) => {

    const [modal, setModal] = useState<{ type: number } | null>(null);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const dropdownContext = useContext(DropdownContext);
    const dropdown = dropdownContext?.dropdown;
    const dropdownRef = dropdownContext?.dropdownRef;
    const handleShowDropdown = dropdownContext?.handleShowDropdown;
    const handleCloseDropdown = dropdownContext?.handleCloseDropdown;

    const handleAddNewProduct = (product: Product) => {
        setProducts([...products, product]);
        setModal(null);
    }

    const handleRemoveProduct = (id: string) => {
        setProducts(products.filter(product => product._id !== id));
        setModal(null);
    }

    const handleUpdateProductList = (updatedProduct: Product) => {
        setProducts(products.map(product => product._id === updatedProduct._id ? updatedProduct : product));
        setModal(null);
    }

    const [idSortOrder, setIdSortOrder] = useState<string | null>(null);
    const [nameSortOrder, setNameSortOrder] = useState<string | null>(null);
    const [priceSortOrder, setPriceSortOrder] = useState<string | null>(null);
    const [quantitySortOrder, setQuantitySortOrder] = useState<string | null>(null);
    const [SKUSortOrder, setSKUSortOrder] = useState<string | null>(null);
    const [categoryNameSortOrder, setCategoryNameSortOrder] = useState<string | null>(null);
    const [dateAddedSortOrder, setDateAddedSortOrder] = useState<string | null>(null);
    const [lastUpdatedSortOrder, setLastUpdatedSortOrder] = useState<string | null>(null);

    const handleSortProductsByType = (sortType: string) => {
        switch (sortType) {
            case "id":
                if (idSortOrder === 'Descending') {
                    setProducts(
                        [...products].sort((a, b) => {
                            return (a._id as string)?.localeCompare(b._id as string);
                        })
                    );
                    setIdSortOrder("Ascending");
                } else if (idSortOrder === 'Ascending' || idSortOrder === null) {
                    setProducts(
                        [...products].sort((a, b) => {
                            return (b._id as string)?.localeCompare(a._id as string);
                        })
                    );
                    setIdSortOrder("Descending");
                }
                break;
            case "name":
                if (nameSortOrder === 'Descending') {
                    setProducts(
                        [...products].sort((a, b) => {
                            return (a.name as string)?.localeCompare(b.name as string);
                        })
                    );
                    setNameSortOrder("Ascending");
                } else if (nameSortOrder === 'Ascending' || nameSortOrder === null) {
                    setProducts(
                        [...products].sort((a, b) => {
                            return (b.name as string)?.localeCompare(a.name as string);
                        })
                    );
                    setNameSortOrder("Descending");
                }
                break;
            case "price":
                if (priceSortOrder === 'Descending') {
                    setProducts(
                        [...products].sort((a, b) => {
                            return a.price - b.price;
                        })
                    );
                    setPriceSortOrder("Ascending");
                } else if (priceSortOrder === 'Ascending' || priceSortOrder === null) {
                    setProducts(
                        [...products].sort((a, b) => {
                            return b.price - a.price;
                        })
                    );
                    setPriceSortOrder("Descending");
                }
                break;
            case "quantity":
                if (quantitySortOrder === 'Descending') {
                    setProducts(
                        [...products].sort((a, b) => {
                            return a.quantity - b.quantity;
                        })
                    );
                    setQuantitySortOrder("Ascending");
                } else if (quantitySortOrder === 'Ascending' || quantitySortOrder === null) {
                    setProducts(
                        [...products].sort((a, b) => {
                            return b.quantity - a.quantity;
                        })
                    );
                    setQuantitySortOrder("Descending");
                }
                break;
            case "categoryName":
                if (categoryNameSortOrder === 'Descending') {
                    setProducts(
                        [...products].sort((a, b) => {
                            return (a.categoryName as string)?.localeCompare(b.categoryName as string);
                        })
                    );
                    setCategoryNameSortOrder("Ascending");
                } else if (categoryNameSortOrder === 'Ascending' || categoryNameSortOrder === null) {
                    setProducts(
                        [...products].sort((a, b) => {
                            return (b.categoryName as string)?.localeCompare(a.categoryName as string);
                        })
                    );
                    setCategoryNameSortOrder("Descending");
                }
                break;
            case "SKU":
                if (SKUSortOrder === 'Descending') {
                    setProducts(
                        [...products].sort((a, b) => {
                            return (a.sku as string)?.localeCompare(b.sku as string);
                        })
                    );
                    setSKUSortOrder("Ascending");
                } else if (SKUSortOrder === 'Ascending' || SKUSortOrder === null) {
                    setProducts(
                        [...products].sort((a, b) => {
                            return (b.sku as string)?.localeCompare(a.sku as string);
                        })
                    );
                    setSKUSortOrder("Descending");
                }
                break;
            case "dateAdded":
                if (dateAddedSortOrder === 'Descending') {
                    setProducts(
                        [...products].sort((a, b) => {
                            return new Date(a.dateAdded as string).getTime() - new Date(b.dateAdded as string).getTime();
                        })
                    );
                    setDateAddedSortOrder("Ascending");
                } else if (lastUpdatedSortOrder === 'Ascending' || lastUpdatedSortOrder === null) {
                    setProducts(
                        [...products].sort((a, b) => {
                            return new Date(b.dateAdded as string).getTime() - new Date(a.dateAdded as string).getTime();
                        })
                    );
                    setDateAddedSortOrder("Descending");
                }
                break;
            case "lastUpdated":
                if (lastUpdatedSortOrder === 'Descending') {
                    setProducts(
                        [...products].sort((a, b) => {
                            return new Date(a.dateAdded as string).getTime() - new Date(b.dateAdded as string).getTime();
                        })
                    );
                    setLastUpdatedSortOrder("Ascending");
                } else if (lastUpdatedSortOrder === 'Ascending' || lastUpdatedSortOrder === null) {
                    setProducts(
                        [...products].sort((a, b) => {
                            return new Date(b.dateAdded as string).getTime() - new Date(a.dateAdded as string).getTime();
                        })
                    );
                    setLastUpdatedSortOrder("Descending");
                }
                break;
            default:
                break;
        }
    }

    return (
        <PageContainer title="Products">

            {categories.length > 0 ?
                <>
                    {products.length > 0 ?
                        <div className="bg-gray-100 rounded w-full p-8 h-full flex flex-col">

                            <div className="flex justify-between mb-4 items-center">
                                <p className="text-gray-600"><span className="font-bold">{products.length}</span> Total Products</p>
                                <button className="cursor-pointer bg-green-200 text-gray-600 p-2 rounded flex flex-row transition hover:bg-green-300 hover:text-gray-700" onClick={() => setModal({ type: 1 })}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Create Product
                                </button>
                            </div>

                            <div className="overflow-auto flex-1">
                                <table className="table-auto w-full text-left min-w-[768px] text-gray-700">
                                    <thead>
                                        <tr className="border-b-1 border-gray-300 font-bold text-gray-600 sticky top-0 bg-gray-100 p-2 z-3">
                                            <th className="p-2 cursor-pointer" onClick={() => handleSortProductsByType("id")}>
                                                <span className="inline-flex gap-2 items-center">
                                                    Id
                                                    {(idSortOrder === "Ascending" || idSortOrder === null) ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                                        </svg>
                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                                        </svg>
                                                    }
                                                </span>
                                            </th>
                                            <th>Image</th>
                                            <th className="p-2 cursor-pointer" onClick={() => handleSortProductsByType("name")}>
                                                <span className="inline-flex gap-2 items-center">
                                                    Name
                                                    {(nameSortOrder === "Ascending" || nameSortOrder === null) ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                                        </svg>
                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                                        </svg>
                                                    }
                                                </span>
                                            </th>
                                            <th className="p-2 cursor-pointer" onClick={() => handleSortProductsByType("price")}>
                                                <span className="inline-flex gap-2 items-center">
                                                    Price
                                                    {(priceSortOrder === "Ascending" || priceSortOrder === null) ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                                        </svg>
                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                                        </svg>
                                                    }
                                                </span>
                                            </th>
                                            <th className="p-2 cursor-pointer" onClick={() => handleSortProductsByType("quantity")}>
                                                <span className="inline-flex gap-2 items-center">
                                                    Quantity
                                                    {(quantitySortOrder === "Ascending" || quantitySortOrder === null) ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                                        </svg>
                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                                        </svg>
                                                    }
                                                </span>
                                            </th>
                                            <th className="p-2 cursor-pointer" onClick={() => handleSortProductsByType("categoryName")}>
                                                <span className="inline-flex gap-2 items-center">
                                                    Category
                                                    {(categoryNameSortOrder === "Ascending" || categoryNameSortOrder === null) ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                                        </svg>
                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                                        </svg>
                                                    }
                                                </span>
                                            </th>
                                            <th className="p-2 cursor-pointer" onClick={() => handleSortProductsByType("SKU")}>
                                                <span className="inline-flex gap-2 items-center">
                                                    SKU
                                                    {(SKUSortOrder === "Ascending" || SKUSortOrder === null) ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                                        </svg>
                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                                        </svg>
                                                    }
                                                </span>
                                            </th>
                                            <th className="p-2 cursor-pointer" onClick={() => handleSortProductsByType("dateAdded")}>
                                                <span className="inline-flex gap-2 items-center">
                                                    Date Added
                                                    {(dateAddedSortOrder === "Ascending" || dateAddedSortOrder === null) ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                                        </svg>
                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                                        </svg>
                                                    }
                                                </span>
                                            </th>
                                            <th className="p-2 cursor-pointer" onClick={() => handleSortProductsByType("lastUpdated")}>
                                                <span className="inline-flex gap-2 items-center">
                                                    Last Updated
                                                    {(lastUpdatedSortOrder === "Ascending" || lastUpdatedSortOrder === null) ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                                        </svg>
                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                                        </svg>
                                                    }
                                                </span>
                                            </th>
                                            <th>Options</th>
                                        </tr>
                                    </thead>
                                    <tbody className="overflow-auto">
                                        {products.map(product =>
                                            <tr className="border-b-1 border-gray-300 hover:bg-gray-200" key={product._id}>
                                                <td className="p-2">
                                                    {product._id}
                                                </td>
                                                <td>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="min-w-10 min-h-10 max-h-10 max-w-10">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                    </svg>
                                                </td>
                                                <td>
                                                    {product.name}
                                                </td>
                                                <td>
                                                    {product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                                </td>
                                                <td>
                                                    {product.quantity}
                                                </td>
                                                <td>
                                                    {product.categoryName}
                                                </td>
                                                <td>
                                                    {product.sku}
                                                </td>
                                                <td>
                                                    {product.dateAdded?.toLocaleString()}
                                                </td>
                                                <td>
                                                    {product.lastUpdated?.toLocaleString()}
                                                </td>
                                                <td className="relative">
                                                    {dropdown && dropdown?.id === product._id ?
                                                        <div className="relative" ref={dropdownRef}>
                                                            <button className="flex cursor-pointer hover:bg-gray-300 rounded transition p-1" onClick={() => handleShowDropdown?.(product._id as string)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                                </svg>
                                                            </button>
                                                            <div className="flex flex-col absolute z-2 border rounded border-gray-400 bg-gray-100 right-full top-0">
                                                                <button className="text-left cursor-pointer hover:bg-gray-200 py-2 px-4" onClick={() => { setModal({ type: 2 }); setSelectedProduct(product); handleCloseDropdown?.() }}>Edit</button>
                                                                <button className="text-left cursor-pointer hover:bg-gray-200 py-2 px-4" onClick={() => { setModal({ type: 3 }); setSelectedProduct(product); handleCloseDropdown?.() }}>Delete</button>
                                                            </div>
                                                        </div>
                                                        :
                                                        <button className="flex cursor-pointer hover:bg-gray-300 rounded transition p-1" onClick={() => handleShowDropdown?.(product._id as string)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                            </svg>
                                                        </button>
                                                    }
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        :
                        <div className="w-screen h-screen absolute top-0 left-0 pl-[170px] flex flex-col justify-center w-full items-center text-center z-1 ">
                            <button className="bg-green-400 p-2 text-green-50 rounded hover:bg-green-500 transition cursor-pointer flex gap-4" onClick={() => { setModal({ type: 1 }) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <p>Create Product</p>
                            </button>
                        </div>
                    }
                </>
                :
                <div className="w-screen h-screen absolute top-0 left-0 pl-[170px] flex flex-col justify-center w-full items-center text-center z-1">
                    <p className="text-3xl text-gray-500 mb-4">Create a category first</p>
                    <Link href="/categories" className="bg-green-400 p-2 text-green-50 rounded hover:bg-green-500 transition">Go to Categories</Link>
                </div>
            }

            {
                modal?.type === 1 &&
                <CreateProductModal categories={categories} handleAddNewProduct={handleAddNewProduct} closeModal={() => setModal(null)} />
            }

            {
                modal?.type === 2 && selectedProduct &&
                <EditProductModal categories={categories} product={selectedProduct} handleUpdateProductList={handleUpdateProductList} closeModal={() => setModal(null)} />
            }

            {
                modal?.type === 3 && selectedProduct && selectedProduct._id &&
                <DeleteProductModal productId={selectedProduct?._id} productName={selectedProduct?.name} handleRemoveProduct={handleRemoveProduct} closeModal={() => setModal(null)} />
            }

        </PageContainer >
    )
}