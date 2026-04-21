import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { TopUpDto, BalanceHistory } from '@/types';

interface BalanceResponse {
  balance: number;
}

async function fetchHistory(): Promise<BalanceHistory[]> {
  const { data } = await api.get<BalanceHistory[]>('/Customer/balance/history');
  return data;
}

async function topUp(body: TopUpDto): Promise<number> {
  const { data } = await api.post<BalanceResponse>('/Customer/balance/top-up', body);
  return data.balance;
}

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const history = await fetchHistory();
      return history.reduce((sum, h) => sum + h.amount, 0);
    },
  });
}

export function useBalanceHistory() {
  return useQuery({
    queryKey: ['balance', 'history'],
    queryFn: fetchHistory,
  });
}

export function useTopUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: topUp,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}