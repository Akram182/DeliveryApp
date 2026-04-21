import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Product } from '@/types';

async function fetchProduct(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/Catalog/products/${id}`);
  return data;
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['catalog', 'product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}