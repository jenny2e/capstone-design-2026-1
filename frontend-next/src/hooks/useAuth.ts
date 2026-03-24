import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User } from '@/types';
import { useAuthStore } from '@/store/authStore';

export function useMe() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get<User>('/auth/me');
      return data;
    },
    enabled: !!token,
    retry: false,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      const { data } = await api.post<{ access_token: string; token_type: string }>(
        '/auth/token',
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      return data;
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => {
      const { data } = await api.post<User>('/auth/register', { username, email, password });
      return data;
    },
  });
}
