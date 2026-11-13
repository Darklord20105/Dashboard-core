import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users')
      return data
    },
    retry: 1,
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async user => {
      const { data } = await api.post('/users', user)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
    },
  })
}