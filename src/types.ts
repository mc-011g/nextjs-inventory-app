export interface User {
    _id?: string,
    firebaseUID?: string,
    email: string,
    firstName: string,
    lastName: string,
    imageLink?: string,
}

export interface Product {
    _id?: string,
    imageLink?: string,
    name: string,
    price: number,
    categoryId: string,
    quantity: number,
    sku: string,
    dateAdded?: Date | string,
    lastUpdated?: Date | string,
    userId?: string,
    categoryName?: string,
}

export interface Category {
    _id?: string,
    name: string,
    description: string,
    dateAdded?: Date | string,
    lastUpdated?: Date | string,
    userId?: string,
}

export interface Order {
    _id?: string,
    customerName: string,
    customerAddress: string,
    customerPhone: string,
    customerEmail: string,
    orderItems: OrderItem[],
    totalPrice: number,
    status?: string,
    notes: string,
    userId?: string,
    dateAdded?: Date | string,
    lastUpdated?: Date | string,
}

export interface OrderItem {
    id?: string
    name: string,
    imageLink?: string,
    price: number,
    quantityOrdered: number,
    categoryId: string,
    userId?: string,
}

export interface TopCategorySale {
    _id: string,
    totalSales: number,
    categoryName: string
}

export interface LowStockProduct {
    _id: string,
    name: string,
    categoryName: string,
    quantity: number,
}

export interface RecentOrder {
    _id: string,
    customerName: string,
    dateAdded?: Date | string,
    lastUpdated?: Date | string,
    status: string,
    totalPrice: number
}