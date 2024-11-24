export interface DeliveryAddress {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  additionalInfo?: string;
}

export interface OrderDetails {
  id: string;
  userId: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  deliveryFee: number;
  grandTotal: number;
  status: 'pending' | 'processing' | 'delivering' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'card';
  deliveryAddress: DeliveryAddress;
  phoneNumber: string;
  orderDate: string;
  deliveryTime?: string;
  notes?: string;
}

export const DELIVERY_FEE = 10;
export const MIN_ORDER_AMOUNT = 29;
export const DELIVERY_HOURS = {
  start: '08:30',
  end: '23:00'
};

export const ALLOWED_CITIES = [
  'Cuxhaven',
  'Wurster Nordseeküste'
];
