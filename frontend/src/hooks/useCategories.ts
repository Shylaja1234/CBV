import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/api/categoriesApi';

export const useCategories = () => {
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 30 * 24 * 60 * 60 * 1000, // 30 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    categories: data?.data || [],
    isLoading,
    error
  };
};

export default useCategories;
