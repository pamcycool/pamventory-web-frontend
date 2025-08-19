import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Types
export interface Product {
    _id: string;
    name: string;
    price: number;
    currentQuantity: number;
    initialQuantity: number;
    restockLevel: number;
    photo?: string;
    category: string;
    description?: string;
    sku?: string;
    isLowStock: boolean;
    totalSold: number;
    lastRestocked: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductData {
    name: string;
    price: string;
    initialQuantity: string;
    restockLevel: string;
    category?: string;
    description?: string;
    sku?: string;
    photo?: File;
}

export interface ProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    stockStatus?: 'low' | 'out' | 'in';
}

export interface InventoryStats {
    totalProducts: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalQuantity: number;
}

export interface StockUpdate {
    type: 'sale' | 'restock' | 'adjustment';
    quantity: number;
    reason?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface LowStockResponse {
    success: boolean;
    data: Product[];
    count: number;
}

// Create product
export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (productData: ProductData) => {
            const formData = new FormData();
            
            // Append text fields
            formData.append('name', productData.name);
            formData.append('price', productData.price);
            formData.append('initialQuantity', productData.initialQuantity);
            formData.append('restockLevel', productData.restockLevel);
            
            if (productData.category) formData.append('category', productData.category);
            if (productData.description) formData.append('description', productData.description);
            if (productData.sku) formData.append('sku', productData.sku);
            if (productData.photo) formData.append('photo', productData.photo);
            
            const response = await api.post('/api/inventory/products', formData);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
        },
    });
};

// Get products with filtering
export const useProducts = (filters: ProductFilters = {}) => {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
            if (filters.stockStatus) params.append('stockStatus', filters.stockStatus);
            
            const response = await api.get(`/api/inventory/products?${params.toString()}`);
            return response.data;
        },
    });
};

// Get single product
export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const response = await api.get(`/api/inventory/products/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};

// Update product
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, productData }: { id: string; productData: Partial<ProductData> }) => {
            const formData = new FormData();
            
            // Append text fields if they exist
            if (productData.name) formData.append('name', productData.name);
            if (productData.price) formData.append('price', productData.price);
            if (productData.initialQuantity) formData.append('initialQuantity', productData.initialQuantity);
            if (productData.restockLevel) formData.append('restockLevel', productData.restockLevel);
            if (productData.category) formData.append('category', productData.category);
            if (productData.description) formData.append('description', productData.description);
            if (productData.sku) formData.append('sku', productData.sku);
            if (productData.photo) formData.append('photo', productData.photo);
            
            const response = await api.put(`/api/inventory/products/${id}`, formData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
        },
    });
};

// Delete product
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/api/inventory/products/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
        },
    });
};

// Update stock
export const useUpdateStock = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, stockData }: { id: string; stockData: StockUpdate }) => {
            const response = await api.patch(`/api/inventory/products/${id}/stock`, stockData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
        },
    });
};

// Get inventory statistics
export const useInventoryStats = () => {
    return useQuery<ApiResponse<InventoryStats>>({
        queryKey: ['inventory-stats'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<InventoryStats>>('/api/inventory/stats');
            return response.data;
        },
    });
};

// Get low stock alerts
export const useLowStockAlerts = () => {
    return useQuery<LowStockResponse>({
        queryKey: ['low-stock-alerts'],
        queryFn: async () => {
            const response = await api.get<LowStockResponse>('/api/inventory/alerts/low-stock');
            return response.data;
        },
    });
};

// Get categories
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/api/inventory/categories');
            return response.data;
        },
    });
};