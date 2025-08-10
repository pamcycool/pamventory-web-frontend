"use client"
import { PageHeader } from "@/app/(dashboard)/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Download, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Loader2, CalendarIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { RecordSalesModal } from "@/components/modals/RecordSales"
import { DeleteSaleModal } from "@/components/modals/DeleteSaleModal"
import { ExportModal } from "@/components/modals/ExportModal"
import { salesColumns } from "@/lib/export-utils"
import { useSales, useSalesFilterOptions, useDeleteSale, type SalesFilters, type Sale, type FilterOptions } from "@/hooks/use-sales-api"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export default function SalesPage() {
  const [open, setOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  
  // Filter states
  const [filters, setFilters] = useState<SalesFilters>({
    page: 1,
    limit: 10,
    sortBy: "saleDate",
    sortOrder: "desc"
  })

  // Get sales data
  const { data: salesResponse, isLoading, error } = useSales(filters)
  const { data: filterOptionsResponse } = useSalesFilterOptions()
  const deleteSale = useDeleteSale()

  // Access data from axios response: salesResponse.data.data and salesResponse.data.pagination
  const sales = salesResponse?.data?.data || []
  const pagination = salesResponse?.data?.pagination
  const filterOptions = filterOptionsResponse?.data?.data

  // Update search filter with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }))
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Update date filters
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      page: 1
    }))
  }, [startDate, endDate])

  const handleFilterChange = (key: keyof SalesFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleSort = (sortBy: SalesFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleDeleteSale = (sale: Sale) => {
    setSelectedSale(sale)
    setDeleteModalOpen(true)
  }

  const confirmDeleteSale = async () => {
    if (!selectedSale) return
    
    try {
      await deleteSale.mutateAsync(selectedSale._id)
      toast.success("Sale deleted successfully")
      setDeleteModalOpen(false)
      setSelectedSale(null)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error && 
        typeof error.response === 'object' && error.response !== null &&
        'data' in error.response && typeof error.response.data === 'object' &&
        error.response.data !== null && 'message' in error.response.data
        ? String(error.response.data.message)
        : "Failed to delete sale"
      toast.error(errorMessage)
    }
  }

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "saleDate",
      sortOrder: "desc"
    })
    setSearchTerm("")
    setStartDate(undefined)
    setEndDate(undefined)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const exportSales = () => {
    setExportModalOpen(true)
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Sales" bannerTitle="Sales" bannerSubtitle="Record all sales made" />
        <div className="p-6">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600">Error loading sales data. Please try again.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHeader title="Sales" bannerTitle="Sales" bannerSubtitle="Record all sales made" />

      <div className="p-6">
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search sales records..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-full"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button 
              className="bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer rounded-full" 
              onClick={() => setOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Record sales
            </Button>
            <Button variant="outline" className="rounded-full" onClick={exportSales}>
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select 
                    value={filters.category || "all"} 
                    onValueChange={(value) => handleFilterChange("category", value === "all" ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {filterOptions?.categories.map((category: string) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Payment Method</label>
                  <Select 
                    value={filters.paymentMethod || "all"} 
                    onValueChange={(value) => handleFilterChange("paymentMethod", value === "all" ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All methods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All methods</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sales Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading sales...</span>
              </div>
            ) : sales.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No sales records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-600">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("saleDate")}
                          className="h-auto p-0 font-medium"
                        >
                          Date & time
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("productName")}
                          className="h-auto p-0 font-medium"
                        >
                          Product name
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("quantity")}
                          className="h-auto p-0 font-medium"
                        >
                          Quantity sold
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("unitPrice")}
                          className="h-auto p-0 font-medium"
                        >
                          Unit Price
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("totalPrice")}
                          className="h-auto p-0 font-medium"
                        >
                          Total Price
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale: Sale) => (
                      <tr key={sale._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-sm">{formatDate(sale.saleDate)}</td>
                        <td className="p-4 text-sm">{sale.productName}</td>
                        <td className="p-4 text-sm">{sale.quantity}</td>
                        <td className="p-4 text-sm">₦ {sale.unitPrice.toLocaleString()}.00</td>
                        <td className="p-4 text-sm">₦ {sale.totalPrice.toLocaleString()}.00</td>
                        <td className="p-4 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSale(sale)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({pagination.totalSales} total sales)
                  </span>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <RecordSalesModal open={open} onOpenChange={setOpen} />
      <DeleteSaleModal 
        open={deleteModalOpen} 
        onOpenChange={setDeleteModalOpen}
        sale={selectedSale}
        onConfirm={confirmDeleteSale}
        isDeleting={deleteSale.isPending}
      />
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        exportData={{
          filename: `sales-export-${new Date().toISOString().split('T')[0]}`,
          data: sales,
          columns: salesColumns
        }}
        title="Export Sales Data"
      />
    </div>
  )
}
