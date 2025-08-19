"use client"
import { PageHeader } from "@/app/[locale]/(dashboard)/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Download, AlertTriangle, CreditCard, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AddCustomerModal } from "@/components/modals/AddCustomerModal"
import { ExportModal } from "@/components/modals/ExportModal"
import { creditColumns } from "@/lib/export-utils"
import { useCustomers, useCustomerStatistics, useCreateCustomer } from "@/hooks/use-credit-api"
import { format } from "date-fns"
import { toast } from "sonner"

export default function CreditBookPage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // API hooks
  const { data: customersData, isLoading: customersLoading } = useCustomers({
    search: searchTerm,
    page: currentPage,
    limit: 10
  })

  const { data: statisticsData } = useCustomerStatistics()

  const createCustomerMutation = useCreateCustomer()

  const handleCreateCustomer = async (customerData: { name: string; phone: string; address: string }) => {
    try {
      await createCustomerMutation.mutateAsync(customerData)
      toast.success("Customer created successfully!")
      setOpen(false)
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        "Failed to create customer"
      )
    }
  }

  const statistics = statisticsData?.data || {
    totalOutstanding: 0,
    totalCustomers: 0,
    overdueAmount: 0,
    creditCustomers: 0
  }

  const customers = Array.isArray(customersData?.data) ? customersData.data : []

  // Debug logging
  console.log('customersData:', customersData)
  console.log('statisticsData:', statisticsData)
  console.log('customers array:', customers)

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '₦ 0.00'
    }
    return `₦ ${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Credit book"
        bannerTitle="Start Your Credit Book!"
        bannerSubtitle="Keep track of customers who buy on credit. Never lose money again!"
      />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#1b7339]">
            <div className="bg-[#1b7339]/10 rounded-full size-7 flex items-center justify-center">
              <p className="text-[#1b7339]">#</p>
            </div>
            <p className="text-sm text-[#333333]/70">Total outstanding amount</p>
            <div className="flex justify-between items-center">
              <p className="text-base text-[#333333]">{formatCurrency(statistics.totalOutstanding)}</p>
            </div>
          </Card>

          <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#034FC8]">
            <div className="bg-[#034FC8]/10 rounded-full size-7 flex items-center justify-center">
              <AlertTriangle className="text-[#034FC8] size-4" />
            </div>
            <p className="text-sm text-[#333333]/70">Overdue amount</p>
            <div className="flex justify-between items-center">
              <p className="text-base text-[#333333]">{formatCurrency(statistics.overdueAmount)}</p>
            </div>
          </Card>

          <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#ff4c48]">
            <div className="bg-[#ff4c48]/10 rounded-full size-7 flex items-center justify-center">
              <User className="text-[#ff4c48] size-4" />
            </div>
            <p className="text-sm text-[#333333]/70">Total customers</p>
            <div className="flex justify-between items-center">
              <p className="text-base text-[#333333]">{statistics.totalCustomers}</p>
            </div>
          </Card>

          <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#A631CA]">
            <div className="bg-[#A631CA]/10 rounded-full size-7 flex items-center justify-center">
              <CreditCard className="text-[#A631CA] size-4" />
            </div>
            <p className="text-sm text-[#333333]/70">Credit customers</p>
            <div className="flex justify-between items-center">
              <p className="text-base text-[#333333]">{statistics.creditCustomers}</p>
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search customer" 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page when searching
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer rounded-full" onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add customer
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => setExportModalOpen(true)}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card className="p-1">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Date & time</th>
                    <th className="text-left p-4 font-medium text-gray-600">Customer name</th>
                    <th className="text-left p-4 font-medium text-gray-600">Phone number</th>
                    <th className="text-left p-4 font-medium text-gray-600">Address</th>
                    <th className="text-left p-4 font-medium text-gray-600">Amount owed</th>
                    <th className="text-left p-4 font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customersLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        Loading customers...
                      </td>
                    </tr>
                  ) : customers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        {searchTerm ? "No customers found matching your search." : "No customers found. Add your first customer to get started."}
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr key={customer._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-sm">{format(new Date(customer.createdAt), "dd/MM/yyyy, hh:mm a")}</td>
                        <td className="p-4 text-sm">{customer.name}</td>
                        <td className="p-4 text-sm">{customer.phone}</td>
                        <td className="p-4 text-sm">{customer.address}</td>
                        <td className="p-4 text-sm">{formatCurrency(customer.balance)}</td>
                        <td className="p-4">
                          <Button variant="outline" size="sm" onClick={() => router.push(`/credit-book/${customer._id}`)}>
                            View details
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddCustomerModal 
        open={open} 
        onOpenChange={setOpen} 
        onSubmit={handleCreateCustomer}
      />
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        exportData={{
          filename: `credit-book-export-${new Date().toISOString().split('T')[0]}`,
          data: customers as unknown as Array<Record<string, unknown>>,
          columns: creditColumns
        }}
        title="Export Credit Book Data"
      />
    </div>
  )
}
