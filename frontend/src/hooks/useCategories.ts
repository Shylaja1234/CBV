import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/api/categoriesApi';

interface Category {
  id: string;
  name: string;
}

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await fetchCategories();
        // Ensure we always return an array
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Return empty array on error
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once on failure
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};

export default useCategories;
