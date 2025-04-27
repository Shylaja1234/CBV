
import { useQuery } from '@tanstack/react-query';
import { fetchProductsMock, fetchProducts } from '@/api/productsApi';
import { Product } from '@/data/products';
import { useMemo } from 'react';

// This value would be set based on environment variables in a real app
// Change to true to use the mock API instead of the actual backend API
const USE_MOCK_API = true;

interface ProductsFilter {
  category?: string;
  search?: string;
  sortBy?: string;
  priceRange?: [number, number];
  ratings?: string[];
  brands?: string[];
}

export const useProducts = (filters: ProductsFilter = {}) => {
  // Memoize filter object to prevent unnecessary re-fetches
  const memoizedFilters = useMemo(() => filters, [
    filters.category,
    filters.search,
    filters.sortBy,
    filters.priceRange?.[0],
    filters.priceRange?.[1],
    filters.ratings?.join(','),
    filters.brands?.join(',')
  ]);
  
  // Use React Query to fetch and cache products
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['products', memoizedFilters],
    queryFn: () => USE_MOCK_API ? fetchProductsMock(memoizedFilters) : fetchProducts(memoizedFilters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
  });

  // Memoize the returned data to prevent re-renders
  const products = useMemo(() => data?.products as Product[] || [], [data?.products]);
  const totalProducts = useMemo(() => data?.total || 0, [data?.total]);

  return {
    products,
    totalProducts,
    isLoading,
    error,
    refetch
  };
};

export default useProducts;
