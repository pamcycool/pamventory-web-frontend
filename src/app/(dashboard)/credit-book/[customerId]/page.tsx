"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useParams } from "next/navigation"
import { AddTransactionModal } from "@/components/modals/AddTransactionModal"
import { useCustomer, useCustomerTransactions, useCreateTransaction } from "@/hooks/use-credit-api"
import { format } from "date-fns"
import { toast } from "sonner"

export default function CustomerCreditPage() {
  const [open, setOpen] = useState(false)
  const [currentPage] = useState(1)
  const params = useParams()
  const customerId = params.customerId as string

  // API hooks
  const { data: customerData, isLoading: customerLoading, error: customerError } = useCustomer(customerId)
  const { data: transactionsData, isLoading: transactionsLoading } = useCustomerTransactions(customerId, {
    page: currentPage,
    limit: 10
  })

  const createTransactionMutation = useCreateTransaction()

  const customer = customerData?.data
  const transactions = transactionsData?.data || []

  const handleCreateTransaction = async (transactionData: {
    type: string;
    amount: string;
    description: string;
    dueDate?: Date;
  }) => {
    try {
      await createTransactionMutation.mutateAsync({
        customerId,
        type: transactionData.type as 'credit-given' | 'payment-received',
        amount: parseFloat(transactionData.amount),
        description: transactionData.description,
        dueDate: transactionData.dueDate?.toISOString()
      })
      toast.success("Transaction created successfully!")
      setOpen(false)
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        "Failed to create transaction"
      )
    }
  }

  const formatCurrency = (amount: number) => `₦ ${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`

  if (customerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading customer details...</p>
      </div>
    )
  }

  if (customerError || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Customer not found or error loading customer details.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white ">
        <Link href="/credit-book" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Customer name : <span className="font-medium">{customer.name}</span>
          </p>
          <p className="text-sm text-gray-600">
            Customer number : <span className="font-medium">{customer.phone}</span>
          </p>
        </div>
      </div>

      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#d50000]">
                        <div className="bg-[#d50000]/10 rounded-full size-7 flex items-center justify-center">
                            <p className="text-[#d50000] ">#</p>
                        </div>
                        <p className="text-sm text-[#333333]/70">Total Credit</p>
                        <div className="flex justify-between items-center">
                            <p className="text-base text-[#333333]">{formatCurrency(customer.totalCredit)}</p>
                        </div>
                    </Card>
                    <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#1b7339]">
                        <div className="bg-[#1b7339]/10 rounded-full size-7 flex items-center justify-center">
                            <p className="text-[#1b7339] ">#</p>
                        </div>
                        <p className="text-sm text-[#333333]/70">Total paid</p>
                        <div className="flex justify-between items-center">
                            <p className="text-base text-[#333333]">{formatCurrency(customer.totalPaid)}</p>
                        </div>
                    </Card>

                    <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#034fc8]">
                        <div className="bg-[#034fc8]/10 rounded-full size-7 flex items-center justify-center">
                            <p className="text-[#034fc8] ">#</p>
                        </div>
                        <p className="text-sm text-[#333333]/70">Balance</p>
                        <div className="flex justify-between items-center">
                            <p className="text-base text-[#333333]">{formatCurrency(customer.balance)}</p>
                        </div>
                    </Card>
     

       

       
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search transaction" className="pl-10" />
          </div>
          <Button className="bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer rounded-full" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 " />
            Add transaction
          </Button>
        </div>

        <Card className="p-1">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Date & time</th>
                    <th className="text-left p-4 font-medium text-gray-600">Transaction type</th>
                    <th className="text-left p-4 font-medium text-gray-600">Amount</th>
                    <th className="text-left p-4 font-medium text-gray-600">Description</th>
                    <th className="text-left p-4 font-medium text-gray-600">Due date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        Loading transactions...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No transactions found. Add a transaction to get started.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-sm">{format(new Date(transaction.createdAt), "dd/MM/yyyy, hh:mm a")}</td>
                        <td className="p-4 text-sm">{transaction.type === 'credit-given' ? 'Credit given' : 'Payment received'}</td>
                        <td className={`p-4 text-sm font-medium ${transaction.type === 'payment-received' ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="p-4 text-sm">{transaction.description}</td>
                        <td className="p-4 text-sm">
                          {transaction.dueDate ? format(new Date(transaction.dueDate), "dd/MM/yyyy") : '-'}
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

      <AddTransactionModal 
        open={open} 
        onOpenChange={setOpen}
        customerName={customer.name}
        onSubmit={handleCreateTransaction}
      />
    </div>
  )
}
