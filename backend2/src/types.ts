export interface ProductFeatures {
  cashOnDelivery: boolean;
  lowestPrice: boolean;
  fiveDayReturns: boolean;
  freeDelivery: boolean;
}
export interface ProductSize {
  S: boolean;
  M: boolean;
  L: boolean;
  XL: boolean;
  XXL: boolean;
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
 S: boolean;
  M: boolean;
  L: boolean;
  XL: boolean;
  XXL: boolean;
}

export interface Product {
  id: string;
  _id: string;
  name: string;
  description: string;
  details: string;
  price: number;
  sellingPrice?: number;
  imageUrls?: string[];
  descriptionName?: string;
  category?: string;
  features?: ProductFeatures;
  size?: ProductSize;
}