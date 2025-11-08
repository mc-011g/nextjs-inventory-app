'use client'

import { Order, Product } from "@/types"
import { useContext, useState } from "react"
import PageContainer from "../PageContainer"
import Link from "next/link"
import { CreateOrderModal } from "../modals/CreateOrderModal"
import { EditOrderModal } from "../modals/EditOrderModal"
import { DeleteOrderModal } from "../modals/DeleteOrderModal"
import { DropdownContext } from "@/app/context/DropdownContext"

export const OrdersPage = ({ initialOrders, products }: { initialOrders: Order[], products: Product[] }) => {

    const [modal, setModal] = useState<{ type: number } | null>(null);
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const dropdownContext = useContext(DropdownContext);
    const dropdown = dropdownContext?.dropdown;
    const dropdownRef = dropdownContext?.dropdownRef;
    const handleShowDropdown = dropdownContext?.handleShowDropdown;
    const handleCloseDropdown = dropdownContext?.handleCloseDropdown;

    const handleAddNewOrder = (order: Order) => {
        setOrders([...orders, order]);
        setModal(null);
    }

    const handleRemoveOrder = (id: string) => {
        setOrders(orders.filter(order => order._id !== id));
        setModal(null);
    }

    const handleEditOrder = (updatedOrder: Order) => {
        setOrders(orders.map(order => order._id === updatedOrder._id ? updatedOrder : order));
        setModal(null);
    }

    const [idSortOrder, setIdSortOrder] = useState<string | null>(null);
    const [customerNameSortOrder, setCustomerNameSortOrder] = useState<string | null>(null);
    const [statusSortOrder, setStatusSortOrder] = useState<string | null>(null);
    const [dateAddedSortOrder, setDateAddedSortOrder] = useState<string | null>(null);
    const [lastUpdatedSortOrder, setLastUpdatedSortOrder] = useState<string | null>(null);

    const handleSortOrdersByType = (sortType: string) => {
        switch (sortType) {
            case "id":
                if (idSortOrder === 'Descending') {
                    setOrders(
                        [...orders].sort((a, b) => {
                            return (a._id as string)?.localeCompare(b._id as string);
                        })
                    );
                    setIdSortOrder("Ascending");
                } else if (idSortOrder === 'Ascending' || idSortOrder === null) {
                    setOrders(
                        [...orders].sort((a, b) => {
                            return (b._id as string)?.localeCompare(a._id as string);
                        })
                    );
                    setIdSortOrder("Descending");
                }
                break;
            case "customerName":
                if (customerNameSortOrder === 'Descending') {
                    setOrders(
                        [...orders].sort((a, b) => {
                            return (a.customerName as string)?.localeCompare(b.customerName as string);
                        })
                    );
                    setCustomerNameSortOrder("Ascending");
                } else if (customerNameSortOrder === 'Ascending' || customerNameSortOrder === null) {
                    setOrders(
                        [...orders].sort((a, b) => {
                            return (b.customerName as string)?.localeCompare(a.customerName as string);
                        })
                    );
                    setCustomerNameSortOrder("Descending");
                }
                break;
            case "status":
                if (statusSortOrder === 'Descending') {
                    setOrders(
                        [...orders].sort((a, b) => {
                            return (a.status as string)?.localeCompare(b.status as string);
                        })
                    );
                    setStatusSortOrder("Ascending");
                } else if (statusSortOrder === 'Ascending' || statusSortOrder === null) {
                    setOrders(
                        [...orders].sort((a, b) => {
                            return (b.status as string)?.localeCompare(a.status as string);
                        })
                    );
                    setStatusSortOrder("Descending");
                }
                break;
            case "dateAdded":
                if (dateAddedSortOrder === 'Descending') {
                    setOrders(
                        [...orders].sort((a, b) => {
                            return new Date(a.dateAdded as string).getTime() - new Date(b.dateAdded as string).getTime();
                        })
                    );
                    setDateAddedSortOrder("Ascending");
                } else if (dateAddedSortOrder === 'Ascending' || dateAddedSortOrder === null) {
                    setOrders(
                        [...orders].sort((a, b) => {
                            return new Date(b.dateAdded as string).getTime() - new Date(a.dateAdded as string).getTime();
                        })
                    );
                    setDateAddedSortOrder("Descending");
                }
                break;
            case "lastUpdated":
                if (lastUpdatedSortOrder === 'Descending') {
                    setOrders(
                        [...orders].sort((a, b) => {
                            return new Date(a.dateAdded as string).getTime() - new Date(b.dateAdded as string).getTime();
                        })
                    );
                    setLastUpdatedSortOrder("Ascending");
                } else if (lastUpdatedSortOrder === 'Ascending' || lastUpdatedSortOrder === null) {
                    setOrders(
                        [...orders].sort((a, b) => {
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
        <PageContainer title="Orders">

            {products && products.length > 0 ?
                <>
                    {orders.length > 0 ?
                        <div className="bg-gray-100 rounded w-full p-8 h-full flex flex-col">

                            <div className="flex justify-between mb-4 items-center">
                                <p className="text-gray-600"><span className="font-bold">{orders.length}</span> Total Orders</p>

                                <button className="cursor-pointer bg-green-200 text-gray-600 p-2 rounded flex flex-row transition hover:bg-green-300 hover:text-gray-700" onClick={() => setModal({ type: 1 })}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Create Order
                                </button>
                            </div>

                            <div className="overflow-auto flex-1">
                                <table className="table-auto w-full text-left min-w-[768px] text-gray-700">
                                    <thead>
                                        <tr className="border-b-1 border-gray-300 font-bold text-gray-600 sticky top-0 bg-gray-100 p-2 z-3">
                                            <th className="p-2 cursor-pointer" onClick={() => handleSortOrdersByType("id")}>
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

                                            <th className="p-2 cursor-pointer" onClick={() => handleSortOrdersByType("customerName")}>
                                                <span className="inline-flex gap-2 items-center">
                                                    Customer Info
                                                    {(customerNameSortOrder === "Ascending" || customerNameSortOrder === null) ?
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

                                            <th>Ordered Items</th>
                                            <th>Notes</th>

                                            <th className="p-2 cursor-pointer" onClick={() => handleSortOrdersByType("status")}>
                                                <span className="inline-flex gap-2 items-center">
                                                    Status
                                                    {(statusSortOrder === "Ascending" || statusSortOrder === null) ?
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

                                            <th className="p-2 cursor-pointer" onClick={() => handleSortOrdersByType("dateAdded")}>
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

                                            <th className="p-2 cursor-pointer" onClick={() => handleSortOrdersByType("lastUpdated")}>
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

                                    <tbody>
                                        {orders.map(order =>
                                            <tr className="border-b-1 border-gray-300 hover:bg-gray-200 " key={order._id}>
                                                <td className="py-4 pr-4 align-top">
                                                    {order._id}
                                                </td>
                                                <td className="py-4 pr-4 align-top">
                                                    <div>{order.customerName}</div>
                                                    <div>{order.customerPhone}</div>
                                                    <div>{order.customerEmail}</div>
                                                    <div>{order.customerAddress}</div>
                                                </td>
                                                <td className="py-4 pr-4 align-top">
                                                    <ul className="flex flex-col gap-2">
                                                        {order.orderItems.map(orderItem =>

                                                            <li key={orderItem.id} className="flex flex-row gap-2">

                                                                {/* <Image alt={orderItem.name} src={orderItem.imageLink || "placeholder.png"} className="bg-gray-300 p-2" width={64} height={64} /> */}

                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="min-w-10 min-h-10 max-h-10 max-w-10">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                                </svg>


                                                                <div className="flex flex-col">
                                                                    <span className="">{orderItem.name}</span>
                                                                    <label>
                                                                        Qty:
                                                                        {orderItem.quantityOrdered}
                                                                    </label>
                                                                </div>

                                                                <div>
                                                                    {(orderItem.quantityOrdered * orderItem.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                                                </div>
                                                            </li>
                                                        )}
                                                    </ul>
                                                    <div className="mt-2">Total:  <span className="font-bold text-gray-500">
                                                        {order.totalPrice.toLocaleString('en-US', { style: 'currency', currency: "USD" })}
                                                    </span>
                                                    </div>
                                                </td>

                                                <td className="py-4 pr-4 ">
                                                    {order.notes}
                                                </td>

                                                <td className="py-4 pr-4">
                                                    {order.status === "Pending" &&
                                                        <div className="p-2 bg-yellow-400 rounded text-yellow-900 font-bold text-center w-fit">{order.status}</div>
                                                    }
                                                    {order.status === "Delivered" &&
                                                        <div className="p-2 bg-green-300 rounded text-green-900 font-bold text-center w-fit">{order.status}</div>
                                                    }
                                                    {order.status === "Shipped" &&
                                                        <div className="p-2 bg-blue-300 rounded text-blue-900 font-bold text-center w-fit">{order.status}</div>
                                                    }
                                                    {order.status === "Cancelled" &&
                                                        <div className="p-2 bg-red-300 rounded text-red-900 font-bold text-center w-fit">{order.status}</div>
                                                    }
                                                    {order.status === "Processing" &&
                                                        <div className="p-2 bg-purple-300 rounded text-purple-900 font-bold text-center w-fit">{order.status}</div>
                                                    }
                                                </td>

                                                <td className="py-4 pr-4">
                                                    {order.dateAdded?.toLocaleString()}
                                                </td>

                                                <td className="py-4 pr-4">
                                                    {order.lastUpdated?.toLocaleString()}
                                                </td>

                                                <td className="relative py-4 pr-4">
                                                    {dropdown?.id === order._id ?
                                                        <div className="relative" ref={dropdownRef}>
                                                            <button className="flex cursor-pointer hover:bg-gray-300 rounded transition p-1" onClick={() => handleShowDropdown?.(order._id as string)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                                </svg>
                                                            </button>
                                                            <div className="flex flex-col absolute right-full top-0 z-2 border rounded border-gray-400 bg-gray-100">
                                                                <button className="text-left cursor-pointer hover:bg-gray-200 py-2 px-4" onClick={() => { setModal({ type: 2 }); setSelectedOrder(order); handleCloseDropdown?.() }}>Edit</button>
                                                                <button className="text-left cursor-pointer hover:bg-gray-200 py-2 px-4" onClick={() => { setModal({ type: 3 }); setSelectedOrder(order); handleCloseDropdown?.() }}>Delete</button>
                                                            </div>
                                                        </div>
                                                        :
                                                        <button className="flex cursor-pointer hover:bg-gray-300 rounded transition p-1" onClick={() => handleShowDropdown?.(order._id as string)}>
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
                                <p>Create Order</p>
                            </button>
                        </div>
                    }
                </>
                :
                <div className="w-screen h-screen absolute top-0 left-0 pl-[170px] flex flex-col justify-center w-full items-center text-center z-1">
                    <p className="text-3xl text-gray-500 mb-4">Create a product first</p>
                    <Link href="/products" className="bg-green-400 p-2 text-green-50 rounded hover:bg-green-500 transition">Go to Products</Link>
                </div>
            }

            {
                modal?.type === 1 &&
                <CreateOrderModal products={products} handleAddNewOrder={handleAddNewOrder} closeModal={() => setModal(null)} />
            }

            {
                modal?.type === 2 && selectedOrder &&
                <EditOrderModal products={products} handleEditOrder={handleEditOrder} closeModal={() => setModal(null)} order={selectedOrder} />
            }

            {
                modal?.type === 3 && selectedOrder && selectedOrder._id &&
                <DeleteOrderModal orderId={selectedOrder?._id} handleRemoveOrder={handleRemoveOrder} closeModal={() => setModal(null)} />
            }
        </PageContainer >
    )
}