export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  stock: number;
  categoryId?: number;
  category?: Category;
}

export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt?: string | Date;
}

export interface OrderItem {
  id?: number;
  orderId?: number;
  productId: number;
  productName?: string;
  name?: string;
  imageUrl?: string | null;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId?: number;
  customer?: Customer;
  customerName?: string;
  email?: string;
  status: string; // e.g. "Pending"
  subtotal: number;
  shippingMethod: string;
  shippingCost: number;
  tax: number;
  total: number;
  items?: OrderItem[];
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ShippingOption = "free" | "express";

export interface CheckoutFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  shippingMethod: ShippingOption;
}

export interface SchemaColumn {
  name: string;
  type: string;
  pk?: boolean;
  fk?: string;
  unique?: boolean;
  nullable: boolean;
  description: string;
}

export interface SchemaTable {
  name: string;
  label: string;
  description: string;
  rowCount: number;
  columns: SchemaColumn[];
}

export interface SchemaResponse {
  success: boolean;
  stats: {
    customers: number;
    categories: number;
    products: number;
    orders: number;
    orderItems: number;
  };
  tables: SchemaTable[];
}
