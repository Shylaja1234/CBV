
import { useQuery } from '@tanstack/react-query';
import { fetchCategoriesMock, fetchCategories } from '@/api/categoriesApi';
import { Category } from '@/data/products';

// This value would be set based on environment variables in a real app
// Change to false to use the actual backend API
const USE_MOCK_API = false;

export const useCategories = () => {
  // Use React Query to fetch and cache categories
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => USE_MOCK_API ? fetchCategoriesMock() : fetchCategories(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - categories rarely change
    gcTime: 30 * 24 * 60 * 60 * 1000, // 30 days (was cacheTime in v4)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Only fetch once per session
  });

  return {
    categories: data as Category[] || [],
    isLoading,
    error
  };
};

export default useCategories;
