
export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  categoryId: number;
  active: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}
