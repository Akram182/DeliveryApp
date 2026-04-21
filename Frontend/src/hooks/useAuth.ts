import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { LoginDto, RegistrationDto, User, AuthResponse } from '@/types';

async function fetchPing(): Promise<User> {
  const { data } = await api.get<User>('/Auth/ping');
  return data;
}

async function postLogin(body: LoginDto): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/Auth/login', body);
  return data;
}

async function postRegister(body: RegistrationDto): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/Auth/register', body);
  return data;
}

export function useLogin() {
  return useMutation({ mutationFn: postLogin });
}

export function useRegister() {
  return useMutation({ mutationFn: postRegister });
}

export function usePing() {
  return useQuery({
    queryKey: ['auth', 'ping'],
    queryFn: fetchPing,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}