export interface ProductFeatures {
  cashOnDelivery: boolean;
  lowestPrice: boolean;
  fiveDayReturns: boolean;
  freeDelivery: boolean;
}
export interface ProductSize {
  US7: boolean;
  US8: boolean;
  US9: boolean;
  US10: boolean;
  US11: boolean;
  US12: boolean;
}

export interface OrderProduct {
  product: {
    _id: string;
    name: string;
    sellingPrice: number;
    imageUrls: string[];
  };
  quantity: number;
  returnRequested: boolean;
  size: string;
}

export type OrderStatus =
  | 'Ordered'
  | 'Shipping'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Returned';

export interface Order {
  id:string;
  customerName: string;
  _id: string;
  products: OrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  deliveryDate: string;
  user: { email: string };
  houseNo: string;
    landmark: string;
    areaPin: string;
    type: string;
    state: string;
    phone: string;
    name: string
}

export interface ProductFeatures {
  cashOnDelivery: boolean;
  lowestPrice: boolean;
  fiveDayReturns: boolean;
  freeDelivery: boolean;
}

export interface ProductSize {
  US7: boolean;
  US8: boolean;
  US9: boolean;
  US10: boolean;
  US11: boolean;
  US12: boolean;
}

export interface Product {
  id: string;
  _id: string;
  name: string;
  brand: string;
  details: string;
  price: number;
  sellingPrice?: number;
  description?: string;
  imageUrls?: string[];
  brandName?: string;
  category?: string;
  features?: ProductFeatures;
  size?: ProductSize;
}