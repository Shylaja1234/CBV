import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchProducts, 
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  ProductInput,
  BackendProduct,
  PaginatedResponse
} from '@/api/productsApi';
import { useMemo } from 'react';

export interface EnrichedProduct extends BackendProduct {
  priceNumber: number;
  displayPriceINR: string;
  icon?: any;
  inStock: boolean;
  featured?: boolean;
  tags?: string[];
  features?: string[];
  image: string;
}

interface ProductsFilter {
  category?: string;
  search?: string;
  sortBy?: string;
  priceRange?: [number, number];
  ratings?: string[];
  brands?: string[];
}

export const useProducts = (filters: ProductsFilter = {}) => {
  const memoizedFilters = useMemo(() => filters, [
    filters.category,
    filters.search,
    filters.sortBy,
    filters.priceRange?.[0],
    filters.priceRange?.[1],
    filters.ratings?.join(','),
    filters.brands?.join(',')
  ]);
  
  const queryClient = useQueryClient();

  const { 
    data: rawData,
    isLoading, 
    error, 
    refetch 
  } = useQuery<PaginatedResponse<EnrichedProduct[]>, Error>({
    queryKey: ['products', memoizedFilters],
    queryFn: async (): Promise<PaginatedResponse<EnrichedProduct[]>> => {
      const backendResponse = await fetchProducts(memoizedFilters);
      return {
        ...backendResponse,
        data: backendResponse.data.map((p: BackendProduct) => ({
          ...p,
          priceNumber: p.price,
          displayPriceINR: `₹${Number(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          icon: null,
          inStock: p.stock > 0,
          featured: false,
          tags: [],
          features: [],
          image: p.imageUrl || ""
        } as EnrichedProduct)),
      } as PaginatedResponse<EnrichedProduct[]>;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const products: EnrichedProduct[] = useMemo(() => rawData?.data || [], [rawData?.data]);
  const totalProducts = useMemo(() => rawData?.total || 0, [rawData?.total]);

  const createProductMutation = useMutation<BackendProduct, Error, ProductInput>({
    mutationFn: async (productData: ProductInput) => {
      const response = await apiCreateProduct(productData);
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error creating product:', error);
    }
  });

  const updateProductMutation = useMutation<BackendProduct, Error, { id: number; productData: Partial<ProductInput> }>({
    mutationFn: async ({ id, productData }) => {
      const response = await apiUpdateProduct(id, productData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiDeleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products,
    totalProducts,
    isLoading,
    error,
    refetch,
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    isCreatingProduct: createProductMutation.isPending,
    isUpdatingProduct: updateProductMutation.isPending,
    isDeletingProduct: deleteProductMutation.isPending,
  };
};

export default useProducts;
