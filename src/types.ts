export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  category_id?: number;
  category_name?: string;
  categories?: {
    id: number;
    name: string;
  };
  discount?: number;
  featured?: boolean;
  rating: number;
  reviews: Array<{
    id: number;
    rating: number;
    comment: string;
    userId: number;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
