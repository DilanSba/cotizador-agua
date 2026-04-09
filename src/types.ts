export type Category = 'Calentadores' | 'Cisternas' | 'Sistemas de tratamiento';

// cash y oriental = mismos precios (cash)
// synchrony y kiwi = mismos precios (synchrony/cuotas)
export type PaymentMode = 'cash' | 'synchrony' | 'oriental' | 'kiwi';

export interface Product {
  id: string;
  category: Category;
  name: string;
  personas: string | null;
  description: string;
  imageUrl: string;
  prices: {
    cash: number | null;
    synchrony: number | null;
    m18: number | null;
    m61: number | null;
  };
  synchronySinIvu?: number;
  ivu?: number;
  cashSinIvu?: number;
  ivuCash?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  installments?: 18 | 61;
}
