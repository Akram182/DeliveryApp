import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { User, UpdateUserDto } from '@/types';

async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>('/Customer/users/me');
  return data;
}

async function updateMe(body: UpdateUserDto): Promise<User> {
  const { data } = await api.patch<User>('/Customer/users/me', body);
  return data;
}

export function useUser() {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: fetchMe,
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (user) => {
      qc.setQueryData(['profile', 'me'], user);
    },
  });
}