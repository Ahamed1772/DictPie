import { axiosInstance } from '../lib/axios.js'
import { useQuery } from '@tanstack/react-query'

export const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ["authUser"],
        queryFn: async() => {
            const response = await axiosInstance.get('/auth/user');
            return response.data
        },
        retry: false
    });
    return { isLoading: authUser.isLoading, isError: authUser.isError, authUser: authUser?.data }
}