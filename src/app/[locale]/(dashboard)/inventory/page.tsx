"use client"
import { PageHeader } from "@/app/[locale]/(dashboard)/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Download, Eye, Edit, Trash2, Package, AlertTriangle, Loader2, Filter, ArrowUpDown } from "lucide-react"
import { useState, useRef } from "react"
import { AddProductModal } from "@/components/modals/AddProductModal"
import { EditProductModal } from "@/components/modals/EditProductModal"
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal"
import { ProductDetailsModal } from "@/components/modals/ProductDetailsModal"
import { ExportModal } from "@/components/modals/ExportModal"
import { inventoryColumns } from "@/lib/export-utils"
import { useProducts, useDeleteProduct, type Product, type ProductFilters } from "@/hooks/use-inventory-api"
import { toast } from "sonner"
import { RequireSubscription } from "@/components/subscription/require-subscription"
import { useTranslations } from "next-intl"

export default function InventoryPage() {
  const t = useTranslations('Inventory')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  })
  const [searchInput, setSearchInput] = useState("")
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const { data: productsData, isLoading, error } = useProducts(filters)
  const deleteProductMutation = useDeleteProduct()
  
  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value, page: 1 }))
    }, 500)
  }
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }
  
  // Handle modal actions
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setDetailsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setEditModalOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedProduct) return
    
    try {
      await deleteProductMutation.mutateAsync(selectedProduct._id)
      toast.success("Product deleted successfully!")
      setDeleteModalOpen(false)
      setSelectedProduct(null)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error && 
        typeof error.response === 'object' && error.response !== null &&
        'data' in error.response && typeof error.response.data === 'object' &&
        error.response.data !== null && 'message' in error.response.data
        ? String(error.response.data.message)
        : t('Failed to delete product')
      toast.error(errorMessage)
    }
  }

  // Handle sort
  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1
    }))
  }

  // Handle filter
  const handleStockFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      stockStatus: status === "all" ? undefined : status as "low" | "out" | "in",
      page: 1
    }))
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price)
  }
  
  // Get stock status badge
  const getStockBadge = (product: Product) => {
    if (product.currentQuantity === 0) {
      return <Badge variant="destructive" className="gap-1"><Package className="w-3 h-3" />Out of Stock</Badge>
    } else if (product.isLowStock) {
      return <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3" />Low Stock</Badge>
    } else {
      return <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800"><Package className="w-3 h-3" />In Stock</Badge>
    }
  }
  
  const products = productsData?.data?.products || []
  const pagination = productsData?.data?.pagination
  return (
    <RequireSubscription>
    <div className="min-h-screen">
      <PageHeader title={t('Inventory')} bannerTitle={t('Inventory')} bannerSubtitle="Manage all products in stock" />

      <div className="p-6">
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder={t('Search products')} 
                className="pl-10" 
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button className="bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer rounded-full" onClick={() => setAddModalOpen(true)}>
                <Plus className="w-4 h-4" />
                {t('Add Product')}
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => setExportModalOpen(true)}>
                <Download className="w-4 h-4" />
                {t('Export')}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={filters.stockStatus || "all"} onValueChange={handleStockFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('Filter')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <Select value={filters.sortBy} onValueChange={(value) => handleSort(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Added</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="currentQuantity">Quantity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Card className="p-1">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">{t('Loading products')}</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-8 text-red-500">
                <AlertTriangle className="w-8 h-8 mr-2" />
                <span>Failed to load products</span>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Package className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('No products found')}</h3>
                <p className="text-sm">Add your first product to get started</p>
                <Button 
                  className="mt-4 bg-[#1b7339] hover:bg-[#1b7339]/80" 
                  onClick={() => setAddModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('Add Product')}
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('createdAt')}>
                        Date & time {filters.sortBy === 'createdAt' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                        {t('Product Name')} {filters.sortBy === 'name' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('price')}>
                        {t('Price')} {filters.sortBy === 'price' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('currentQuantity')}>
                        {t('Stock')} {filters.sortBy === 'currentQuantity' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600">Status</th>
                      <th className="text-left p-4 font-medium text-gray-600">{t('Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: Product) => (
                      <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-sm">{formatDate(product.createdAt)}</td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            {product.category && (
                              <div className="text-xs text-gray-500">{product.category}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm font-medium">{formatPrice(product.price)}</td>
                        <td className="p-4 text-sm">{product.currentQuantity}</td>
                        <td className="p-4">{getStockBadge(product)}</td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title={t('View')}
                              onClick={() => handleViewProduct(product)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title={t('Edit')}
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title={t('Delete')}
                              onClick={() => handleDeleteProduct(product)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <span>←</span> Prev
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next <span>→</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddProductModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      
      <EditProductModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen} 
        product={selectedProduct}
      />
      
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        product={selectedProduct}
        onConfirm={confirmDelete}
        isDeleting={deleteProductMutation.isPending}
      />
      
      <ProductDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        product={selectedProduct}
        onEdit={() => {
          setDetailsModalOpen(false)
          setEditModalOpen(true)
        }}
        onDelete={() => {
          setDetailsModalOpen(false)
          setDeleteModalOpen(true)
        }}
      />
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        exportData={{
          filename: `inventory-export-${new Date().toISOString().split('T')[0]}`,
          data: products,
          columns: inventoryColumns
        }}
        title="Export Inventory Data"
      />
    </div>
    </RequireSubscription>
  )
}
