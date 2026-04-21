import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types';

async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/Admin/category');
  return data;
}

async function createCategory(body: CreateCategoryDto): Promise<Category> {
  const { data } = await api.post<Category>('/Admin/category', body);
  return data;
}

async function updateCategory(body: UpdateCategoryDto): Promise<Category> {
  const { data } = await api.put<Category>('/Admin/category', body);
  return data;
}

async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/Admin/category/${id}`);
}

export function useCategories() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: fetchCategories,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  });
}