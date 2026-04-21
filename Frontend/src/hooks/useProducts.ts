import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Product } from '@/types';

interface ProductsResponse {
  items: Product[];
  nextCursor?: number;
}

interface UseProductsOptions {
  category: string;
  chunkLength?: number;
}

async function fetchProducts({
  category,
  chunkLength = 20,
  cursor = 0,
}: UseProductsOptions & { cursor: number }): Promise<ProductsResponse> {
  const { data } = await api.get<Product[]>('/Catalog/products', {
    params: {
      category,
      chunkLength,
      ...(cursor > 0 && { chunkStart: cursor }),
    },
  });
  return {
    items: data,
    nextCursor: data.length === chunkLength ? cursor + chunkLength : undefined,
  };
}

export function useProducts({ category, chunkLength = 20 }: UseProductsOptions) {
  return useInfiniteQuery({
    queryKey: ['catalog', 'products', category],
    queryFn: ({ pageParam }) =>
      fetchProducts({ category, chunkLength, cursor: pageParam ?? 0 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5,
    enabled: !!category,
  });
}