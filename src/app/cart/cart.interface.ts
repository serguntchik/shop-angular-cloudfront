import { Product } from '../products/product.interface';

export interface CartItem {
  product: Product;
  count: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
}
