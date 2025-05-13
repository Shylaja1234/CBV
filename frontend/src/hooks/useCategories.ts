import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/api/categoriesApi';

interface Category {
  id: string;
  name: string;
}

// Mock categories as fallback
const mockCategories: Category[] = [
  { id: "infrastructure", name: "IT Infrastructure" },
  { id: "user-devices", name: "User Devices" },
  { id: "networking", name: "Networking" },
  { id: "security", name: "Security" },
  { id: "solutions", name: "Solutions" }
];

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await fetchCategories();
        // If we get a valid response, use it
        if (Array.isArray(response) && response.length > 0) {
          return response;
        }
        // Otherwise, use mock data
        console.log('Using mock categories as fallback');
        return mockCategories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Return mock data on error
        return mockCategories;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once on failure
    refetchOnWindowFocus: false, // Don't refetch on window focus
    // Always return mock data as initial data
    initialData: mockCategories,
  });
};

export default useCategories;
