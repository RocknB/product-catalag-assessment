import api from "./api";
import type { Product, ProductRequest } from "../types";

export const productService = {
  getAll: async () => {
    const response = await api.get<Product[]>("/products");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  getCount: async () => {
    const response = await api.get<number>("/products/count");
    return response.data;
  },

  create: async (data: ProductRequest) => {
    const response = await api.post<Product>("/products", data);
    return response.data;
  },

  update: async (id: number, data: ProductRequest) => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/products/${id}`);
  },
};
