import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Category } from '@/types';

async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/Catalog/categories');
  return Array.isArray(data) ? data : [];
}

export function useCategories() {
  return useQuery({
    queryKey: ['catalog', 'categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });
}