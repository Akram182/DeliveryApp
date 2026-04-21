import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Address, CreateAddressDto } from '@/types';

async function fetchAddresses(): Promise<Address[]> {
  const { data } = await api.get<Address[]>('/Customer/users/me/addresses');
  return data;
}

async function createAddress(body: CreateAddressDto): Promise<Address> {
  const { data } = await api.post<Address>('/Customer/users/me/addresses', body);
  return data;
}

async function deleteAddress(id: string): Promise<void> {
  await api.delete(`/Customer/users/me/addresses/${id}`);
}

export function useAddresses() {
  return useQuery({
    queryKey: ['profile', 'addresses'],
    queryFn: fetchAddresses,
  });
}

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile', 'addresses'] });
    },
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile', 'addresses'] });
    },
  });
}