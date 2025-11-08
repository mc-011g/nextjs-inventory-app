import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Modal } from "./Modal"
import { Order, OrderItem, Product } from "@/types";
import Image from "next/image";
import { updateOrderUtil } from "@/util/orders/updateOrderUtil";
import { ToastContext } from "@/app/context/ToastContext";
import { AuthContext } from "../FirebaseAuthProvider";

export const EditOrderModal = ({ closeModal, handleEditOrder, products, order }:
    { products: Product[], closeModal: () => void, handleEditOrder: (value: Order) => void, order: Order }) => {

    const [customerName, setCustomerName] = useState<string>(order.customerName);
    const [customerAddress, setCustomerAddress] = useState<string>(order.customerAddress);
    const [customerPhone, setCustomerPhone] = useState<string>(order.customerPhone);
    const [customerEmail, setCustomerEmail] = useState<string>(order.customerEmail);
    const [orderItems, setOrderItems] = useState<OrderItem[]>(order.orderItems);
    const [totalPrice, setTotalPrice] = useState<number>(order.totalPrice);
    const [notes, setNotes] = useState<string>(order.notes || "");
    const [status, setStatus] = useState<string>(order.status || "n/a");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const toastContext = useContext(ToastContext);

    const [checkedProducts, setCheckedProducts] = useState<{ id: string, checked: boolean }[]>([]);

    useEffect(() => {
        setCheckedProducts(order.orderItems.map(item => ({ id: item.id as string, checked: true })));
    }, [order.orderItems]);

    const handleUpdateOrder = async () => {
        if (!user) {
            setError("User not authenticated");
            toastContext?.handleShowToast("error", "You must be signed in.");
            return;
        }

        if (orderItems && orderItems.length > 0) {
            setIsLoading(true);
            const newOrderUpdate: Order = {
                _id: order._id,
                customerName,
                customerEmail,
                customerAddress,
                customerPhone,
                orderItems,
                totalPrice,
                notes,
                status
            };

            try {
                const userIdToken = await user.getIdToken();
                const updatedOrder = await updateOrderUtil(newOrderUpdate, userIdToken);

                handleEditOrder(updatedOrder);
                toastContext?.handleShowToast("success", "Successfully changed order details.");
            } catch (error) {
                setError((error as Error).message ?? "Failed to update order");
                toastContext?.handleShowToast("error", "Failed to edit order.");
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleUpdateOrderProductList = (product: Product) => {
        const id = product._id as string;
        const productChecked = isProductChecked(id);

        if (productChecked === true) {
            setCheckedProducts(checkedProducts.map(checkedProduct => checkedProduct.id === id ? { id, checked: false } : checkedProduct));
            setOrderItems(orderItems.filter(orderItem => orderItem.id !== product._id));

        } else if (productChecked === false) {
            setCheckedProducts(checkedProducts.map(checkedProduct => checkedProduct.id === id ? { id, checked: true } : checkedProduct));
            setOrderItems([...orderItems, { id: product._id, name: product.name, quantityOrdered: 1, imageLink: "/placeholder.png", price: product.price, categoryId: product.categoryId }]);

        } else {
            setCheckedProducts([...checkedProducts, { id, checked: true }]);
            setOrderItems([...orderItems, { id: product._id, name: product.name, quantityOrdered: 1, imageLink: "/placeholder.png", price: product.price, categoryId: product.categoryId }]);
        }
    }

    useEffect(() => {
        if (orderItems) {
            let totalPrice = 0;
            orderItems.forEach(item => totalPrice += item.price * item.quantityOrdered);
            setTotalPrice(totalPrice);
        }
    }, [orderItems]);

    const isProductChecked = (id: string) => {
        const checkedProduct = checkedProducts.find(checkedProduct => checkedProduct.id === id);

        if (!checkedProduct) {
            return;
        }

        return checkedProduct.checked;
    }

    const handleChangeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;
        setStatus(status);
    }

    return (
        <Modal title="Edit Order" closeModal={closeModal}>
            <form className="flex flex-col gap-4 text-gray-600 justify-between h-full" onSubmit={e => { e.preventDefault(); handleUpdateOrder() }}>

                <div className="flex flex-col gap-4">
                    <span className="font-bold mt-4">Status</span>
                    <select className="rounded bg-gray-200 py-2 px-4" value={status} onChange={e => handleChangeStatus(e)} required>
                        <option className="rounded bg-gray-200 py-2 px-4" value={"Pending"}>Pending</option>
                        <option className="rounded bg-gray-200 py-2 px-4" value={"Processing"}>Processing</option>
                        <option className="rounded bg-gray-200 py-2 px-4" value={"Shipped"}>Shipped</option>
                        <option className="rounded bg-gray-200 py-2 px-4" value={"Delivered"}>Delivered</option>
                        <option className="rounded bg-gray-200 py-2 px-4" value={"Cancelled"}>Cancelled</option>
                    </select>
                </div>

                <div className="flex flex-col gap-4">
                    <span className="font-bold mt-4">Customer Information</span>

                    <div className="flex flex-col gap-2">
                        <label className="flex flex-col">
                            Full Name
                            <input required maxLength={80} type="text" placeholder="Firstname Lastname" className="rounded bg-gray-200 py-2 px-4" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                        </label>

                        <label className="flex flex-col">
                            Email
                            <input required maxLength={80} type="email" placeholder="email@email.com" className="rounded bg-gray-200 py-2 px-4" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                        </label>

                        <label className="flex flex-col">
                            Phone
                            <input required maxLength={10} type="tel" placeholder="123-4567-8999" className="rounded bg-gray-200 py-2 px-4" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                        </label>

                        <label className="flex flex-col">
                            Street Address
                            <input required maxLength={80} type="text" placeholder="123 Ave. SW" className="rounded bg-gray-200 py-2 px-4" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
                        </label>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <span className="font-bold mt-4">Items Ordered</span>

                    <div className="flex flex-col gap-4 p-4 rounded border border-gray-400">

                        <label className="flex flex-col">
                            <span className="font-bold">Select Products</span>
                            <ul className="flex flex-col gap-1 mt-2">
                                {products.map(product => product._id && checkedProducts &&
                                    <li key={product._id} className="inline-flex gap-2">
                                        <input type="checkbox" checked={isProductChecked(product._id) ? true : false} onChange={() => handleUpdateOrderProductList(product)} />
                                        {product.name}
                                    </li>
                                )}
                            </ul>
                        </label>

                        <hr className="text-gray-400" />

                        Order Items
                        <ul className="flex flex-col gap-2">
                            {orderItems?.map(orderItem =>
                                <li key={orderItem.id} className="flex flex-row gap-2">
                                    <Image alt={orderItem.name} src={orderItem.imageLink || "placeholder.png"} className="bg-gray-300 p-2" width={64} height={64} />

                                    <div className="flex flex-col">
                                        <span className="">{orderItem.name}</span>
                                        <label>
                                            Qty:
                                            <input required type="number" min={0} max={1000} className="ml-2 rounded bg-gray-200 p-2" value={orderItem.quantityOrdered} onChange={e => setOrderItems(orderItems.map(item => item.id === orderItem.id ? { ...item, quantityOrdered: Number(e.target.value) } : item))} />
                                        </label>
                                    </div>

                                    <div>${new Intl.NumberFormat().format(orderItem.quantityOrdered * orderItem.price)}</div>
                                </li>
                            )}
                        </ul>

                        <div>Total Price: <span className="font-bold">${new Intl.NumberFormat('en-US').format(totalPrice)}</span></div>
                    </div>

                    <label className="flex flex-col">
                        <span className="text-gray-500">Notes (optional)</span>
                        <textarea maxLength={200} rows={4} placeholder="Notes" className="rounded bg-gray-200 py-2 px-4 resize-none" value={notes} onChange={(e) => setNotes(e.target.value)} />
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