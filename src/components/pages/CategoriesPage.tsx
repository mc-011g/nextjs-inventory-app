'use client'

import { Category } from "@/types"
import { useContext, useState } from "react"
import PageContainer from "../PageContainer"
import { CreateCategoryModal } from "../modals/CreateCategoryModal"
import { EditCategoryModal } from "../modals/EditCategoryModal"
import { DeleteCategoryModal } from "../modals/DeleteCategoryModal"
import { DropdownContext } from "@/app/context/DropdownContext"

export const CategoriesPage = ({ initialCategories }: { initialCategories: Category[] }) => {
   
        const [modal, setModal] = useState<{ type: number } | null>(null);
        const [categories, setCategories] = useState<Category[]>(initialCategories);
        const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
   
        const dropdownContext = useContext(DropdownContext);
        const dropdown = dropdownContext?.dropdown;
        const dropdownRef = dropdownContext?.dropdownRef;
        const handleShowDropdown = dropdownContext?.handleShowDropdown;
        const handleCloseDropdown = dropdownContext?.handleCloseDropdown;

        const handleAddNewCategory = (category: Category) => {
                setCategories([...categories, category]);
                setModal(null);
        }

        const handleRemoveCategory = (id: string) => {
                setCategories(categories.filter(category => category._id !== id));
                setModal(null);
        }

        const handleUpdateCategory = (updatedCategory: Category) => {
                setCategories(categories.map(category => category._id === updatedCategory._id ? updatedCategory : category));
                setModal(null);
        }
    
        const [idSortOrder, setIdSortOrder] = useState<string | null>(null);
        const [nameSortOrder, setNameSortOrder] = useState<string | null>(null);
        const [descriptionSortOrder, setDescriptionSortOrder] = useState<string | null>(null);
        const [dateAddedSortOrder, setDateAddedSortOrder] = useState<string | null>(null);
        const [lastUpdatedSortOrder, setLastUpdatedSortOrder] = useState<string | null>(null);

        const handleSortCategoriesByType = (sortType: string) => {
                switch (sortType) {
                        case "id":
                                if (idSortOrder === 'Descending') {
                                        setCategories(
                                                [...categories].sort((a, b) => {
                                                        return (a._id as string)?.localeCompare(b._id as string);
                                                })
                                        );
                                        setIdSortOrder("Ascending");
                                } else if (idSortOrder === 'Ascending' || idSortOrder === null) {
                                        setCategories(
                                                [...categories].sort((a, b) => {
                                                        return (b._id as string)?.localeCompare(a._id as string);
                                                })
                                        );
                                        setIdSortOrder("Descending");
                                }
                                break;
                        case "name":               
                                if (nameSortOrder === 'Descending') {
                                        setCategories(
                                                [...categories].sort((a, b) => {
                                                        return (a.name as string)?.localeCompare(b.name as string);
                                                })
                                        );
                                        setNameSortOrder("Ascending");
                                } else if (nameSortOrder === 'Ascending' || nameSortOrder === null) {
                                        setCategories(
                                                [...categories].sort((a, b) => {
                                                        return (b.name as string)?.localeCompare(a.name as string);
                                                })
                                        );
                                        setNameSortOrder("Descending");
                                }
                                break;
                        case "description":          
                                if (descriptionSortOrder === 'Descending') {
                                        setCategories(
                                                [...categories].sort((a, b) => {
                                                        return (a.description as string)?.localeCompare(b.description as string);
                                                })
                                        );
                                        setDescriptionSortOrder("Ascending");
                                } else if (descriptionSortOrder === 'Ascending' || descriptionSortOrder === null) {
                                        setCategories(
                                                [...categories].sort((a, b) => {
                                                        return (b.description as string)?.localeCompare(a.description as string);
                                                })
                                        );
                                        setDescriptionSortOrder("Descending");
                                }
                                break;
                        case "dateAdded":
                                if (dateAddedSortOrder === 'Descending') {
                                        setCategories(
                                                [...categories].sort((a, b) => {
                                                        return new Date(a.dateAdded as string).getTime() - new Date(b.dateAdded as string).getTime();
                                                })
                                        );
                                        setDateAddedSortOrder("Ascending");
                                } else if (dateAddedSortOrder === 'Ascending' || dateAddedSortOrder === null) {
                                        setCategories(
                                                [...categories].sort((a, b) => {
                                                        return new Date(b.dateAdded as string).getTime() - new Date(a.dateAdded as string).getTime();
                                                })
                                        );
                                        setDateAddedSortOrder("Descending");
                                }
                                break;
                        case "lastUpdated":
                                if (lastUpdatedSortOrder === 'Descending') {
                                        setCategories(
                                                [...categories].sort((a, b) => {
                                                        return new Date(a.dateAdded as string).getTime() - new Date(b.dateAdded as string).getTime();
                                                })
                                        );
                                        setLastUpdatedSortOrder("Ascending");
                                } else if (lastUpdatedSortOrder === 'Ascending' || lastUpdatedSortOrder === null) {
                                        setCategories(
                                                [...categories].sort((a, b) => {
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
                <PageContainer title="Categories">

                        {categories.length > 0 ?
                                <div className="bg-gray-100 rounded w-full p-8 h-full flex flex-col">

                                        <div className="flex justify-between mb-4 items-center">
                                                <p className="text-gray-600"><span className="font-bold">{categories.length}</span> Total Categories</p>
                                                <button className="cursor-pointer bg-green-200 text-gray-600 p-2 rounded flex flex-row transition hover:bg-green-300 hover:text-gray-700 flex gap-1" onClick={() => setModal({ type: 1 })}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                        </svg>
                                                        Create Category
                                                </button>
                                        </div>

                                        <div className="overflow-auto flex-1">
                                                <table className="table-auto w-full text-left min-w-[768px] text-gray-700">
                                                        <thead>
                                                                <tr className="border-b-1 border-gray-300 font-bold text-gray-600 sticky top-0 bg-gray-100 p-2 z-3">
                                                                        <th className="p-2 cursor-pointer" onClick={() => handleSortCategoriesByType("id")}>
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
                                                                        <th className="p-2 cursor-pointer" onClick={() => handleSortCategoriesByType("name")}>
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
                                                                        <th className="p-2 cursor-pointer" onClick={() => handleSortCategoriesByType("description")}>
                                                                                <span className="inline-flex gap-2 items-center">
                                                                                        Description
                                                                                        {(descriptionSortOrder === "Ascending" || descriptionSortOrder === null) ?
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
                                                                        <th className="p-2 cursor-pointer" onClick={() => handleSortCategoriesByType("dateAdded")}>
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
                                                                        <th className="p-2 cursor-pointer" onClick={() => handleSortCategoriesByType("lastUpdated")}>
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
                                                                {categories.map(category =>
                                                                        <tr className="border-b-1 border-gray-300 hover:bg-gray-200" key={category._id}>
                                                                                <td className="p-2">
                                                                                        {category._id}
                                                                                </td>
                                                                                <td>
                                                                                        {category.name}
                                                                                </td>
                                                                                <td>
                                                                                        {category.description}
                                                                                </td>
                                                                                <td>
                                                                                        {category.dateAdded?.toLocaleString()}
                                                                                </td>
                                                                                <td>
                                                                                        {category.lastUpdated?.toLocaleString()}
                                                                                </td>
                                                                                <td className="relative">

                                                                                        {dropdown?.id === category._id ?
                                                                                                <div className="relative" ref={dropdownRef}>
                                                                                                        <button className="flex cursor-pointer hover:bg-gray-300 rounded transition p-1" onClick={() => handleShowDropdown && handleShowDropdown(category._id as string)}>
                                                                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                                                                                </svg>
                                                                                                        </button>
                                                                                                        <div className="flex flex-col absolute border rounded border-gray-400 bg-gray-100 z-50 right-full top-0">
                                                                                                                <button className="text-left cursor-pointer hover:bg-gray-200 py-2 px-4" onClick={() => { setModal({ type: 2 }); setSelectedCategory(category); handleCloseDropdown?.apply(handleCloseDropdown); }}>Edit</button>
                                                                                                                <button className="text-left cursor-pointer hover:bg-gray-200 py-2 px-4" onClick={() => { setModal({ type: 3 }); setSelectedCategory(category); handleCloseDropdown?.apply(handleCloseDropdown); }}>Delete</button>
                                                                                                        </div>
                                                                                                </div>
                                                                                                :
                                                                                                <button className="flex cursor-pointer hover:bg-gray-300 rounded transition p-1" onClick={() => handleShowDropdown && handleShowDropdown(category._id as string)}>
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
                                                <p>Create Category</p>
                                        </button>
                                </div>
                        }

                        {modal?.type === 1 &&
                                <CreateCategoryModal handleAddNewCategory={handleAddNewCategory} closeModal={() => setModal(null)} />
                        }
                        {modal?.type === 2 && selectedCategory &&
                                <EditCategoryModal category={selectedCategory} handleUpdateCategory={handleUpdateCategory} closeModal={() => setModal(null)} />
                        }
                        {modal?.type === 3 && selectedCategory && selectedCategory._id &&
                                <DeleteCategoryModal categoryId={selectedCategory._id} categoryName={selectedCategory?.name} handleRemoveCategory={handleRemoveCategory} closeModal={() => setModal(null)} />
                        }

                </PageContainer>
        )
}