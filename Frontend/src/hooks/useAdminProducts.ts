import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Product, CreateProductDto, UpdateProductDto } from '@/types';

async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/Admin/product');
  return data;
}

async function createProduct(body: CreateProductDto): Promise<Product> {
  const { data } = await api.post<Product>('/Admin/product', body);
  return data;
}

async function updateProduct(body: UpdateProductDto): Promise<Product> {
  const { data } = await api.put<Product>('/Admin/product', body);
  return data;
}

async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/Admin/product/${id}`);
}

export function useProducts() {
  return useQuery({
    queryKey: ['admin', 'products'],
    queryFn: fetchProducts,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
}