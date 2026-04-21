import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Order, CreateOrderDto } from '@/types';

interface OrdersResponse {
  items: Order[];
  totalCount: number;
  page: number;
  pageSize: number;
}

interface UseOrdersOptions {
  page?: number;
  pageSize?: number;
}

async function fetchOrders({
  page = 1,
  pageSize = 10,
}: UseOrdersOptions): Promise<OrdersResponse> {
  const { data } = await api.get<Order[]>('/Customer/orders', {
    params: { page, pageSize },
  });
  return { items: data, totalCount: data.length, page, pageSize };
}

async function fetchOrder(id: string): Promise<Order> {
  const { data } = await api.get<Order>(`/Customer/orders/${id}`);
  return data;
}

async function createOrder(body: CreateOrderDto): Promise<Order> {
  const { data } = await api.post<Order>('/Customer/orders', body);
  return data;
}

export function useOrders({ page = 1, pageSize = 10 }: UseOrdersOptions = {}) {
  return useQuery({
    queryKey: ['orders', page],
    queryFn: () => fetchOrders({ page, pageSize }),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => fetchOrder(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}