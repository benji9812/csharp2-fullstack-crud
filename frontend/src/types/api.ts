export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  productCount: number;
}

export interface CreateCategory {
  name: string;
  description?: string;
}

export interface UpdateCategory {
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
}

export interface CreateProduct {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
}

export interface UpdateProduct {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
}
