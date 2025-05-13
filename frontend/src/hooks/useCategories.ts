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
      const response = await fetchCategories();
      // The backend returns the categories array directly
      return Array.isArray(response) ? response : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export default useCategories;
