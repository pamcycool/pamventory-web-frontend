import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface UpdateProfileData {
  name: string;
  email: string;
  phone: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const useProfileApi = () => {
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await api.put('/api/auth/profile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });

  const changePassword = useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await api.put('/api/auth/change-password', data);
      return response.data;
    }
  });

  return {
    updateProfile,
    changePassword
  };
};