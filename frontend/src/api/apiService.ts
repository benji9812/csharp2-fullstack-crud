import type {
  Category,
  CreateCategory,
  UpdateCategory,
  Product,
  CreateProduct,
  UpdateProduct,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `API-fel (${response.status}: ${response.statusText})`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch {
      // Keep default error message if JSON parsing fails
    }
    throw new Error(errorMessage);
  }
  
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiService = {
  // Categories API
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse<Category[]>(res);
  },

  async getCategoryById(id: number): Promise<Category> {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`);
    return handleResponse<Category>(res);
  },

  async createCategory(data: CreateCategory): Promise<Category> {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Category>(res);
  },

  async updateCategory(id: number, data: UpdateCategory): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<void>(res);
  },

  async deleteCategory(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(res);
  },

  // Products API
  async getProducts(categoryId?: number): Promise<Product[]> {
    const url = categoryId
      ? `${API_BASE_URL}/products?categoryId=${categoryId}`
      : `${API_BASE_URL}/products`;
    const res = await fetch(url);
    return handleResponse<Product[]>(res);
  },

  async getProductById(id: number): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse<Product>(res);
  },

  async createProduct(data: CreateProduct): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(res);
  },

  async updateProduct(id: number, data: UpdateProduct): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<void>(res);
  },

  async deleteProduct(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(res);
  },
};
