"use client"
import React from "react"
import { PageHeader } from "@/app/[locale]/(dashboard)/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, BarChart3, FileText, Package } from "lucide-react"
import Link from "next/link"
import { useSales } from "@/hooks/use-sales-api"
import { formatCurrency, isToday } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

type SaleData = {
  _id: string
  saleDate: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export default function HomePage() {
  // Get sales data
  const { data: recentSales, isLoading: isLoadingSalesData, error: salesError } = useSales({ 
    limit: 50, 
    sortBy: 'saleDate', 
    sortOrder: 'desc' 
  })

  // Calculate today's sales from the actual sales data
  const todaysSales = React.useMemo(() => {
    // Access data from axios response: recentSales.data.data
    const salesData = recentSales?.data?.data
    if (!Array.isArray(salesData)) return { totalRevenue: 0, totalSales: 0 }
    
    const todaysData = salesData.filter((sale: SaleData) => isToday(sale.saleDate))
    return {
      totalRevenue: todaysData.reduce((sum: number, sale: SaleData) => sum + sale.totalPrice, 0),
      totalSales: todaysData.length
    }
  }, [recentSales])

  // Calculate top selling product from actual sales data
  const topSalesItem = React.useMemo(() => {
    // Access data from axios response: recentSales.data.data
    const salesData = recentSales?.data?.data
    if (!Array.isArray(salesData)) return { productName: "None", salesCount: 0 }
    
    // Group sales by product name and sum quantities
    const productSales = salesData.reduce((acc: Record<string, number>, sale: SaleData) => {
      acc[sale.productName] = (acc[sale.productName] || 0) + sale.quantity
      return acc
    }, {})
    
    // Find the product with highest total quantity sold
    const topProduct = Object.entries(productSales).reduce(
      (max, [productName, quantity]) => 
        quantity > max.salesCount ? { productName, salesCount: quantity } : max,
      { productName: "None", salesCount: 0 }
    )
    
    return topProduct
  }, [recentSales])

  const isLoading = isLoadingSalesData
  return (
    <div className="min-h-screen ">
      <PageHeader title="Home" bannerTitle="Welcome, Pamela!" bannerSubtitle="Manage all your inventory and sales" />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#1B7339]">
            <div className="bg-[#1B7339]/10 rounded-full size-7 flex items-center justify-center">
              <p className="text-[#1b7339]">#</p>
            </div>
            <p className="text-sm text-[#333333]/70">Today&apos;s sales</p>
            <div className="flex justify-between items-center">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-20" />
                </>
              ) : salesError ? (
                <>
                  <p className="text-base text-red-500">Error</p>
                  <p className="text-sm text-[#333333]/70">Unable to load</p>
                </>
              ) : (
                <>
                  <p className="text-base text-[#333333]">
                    {formatCurrency(todaysSales.totalRevenue)}
                  </p>
                  <p className="text-sm text-[#333333]/70">
                    {todaysSales.totalSales} Total sales
                  </p>
                </>
              )}
            </div>
          </Card>

          <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#034FC8]">
            <div className="bg-[#034FC8]/10 rounded-full size-7 flex items-center justify-center">
              <ShoppingCart className="text-[#034FC8] size-4" />
            </div>
            <p className="text-sm text-[#333333]/70">Top sales item</p>
            <div className="flex justify-between items-center">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-20" />
                </>
              ) : salesError ? (
                <>
                  <p className="text-base text-red-500">Error</p>
                  <p className="text-sm text-[#333333]/70">Unable to load</p>
                </>
              ) : (
                <>
                  <p className="text-base text-[#333333]">
                    {topSalesItem.productName}
                  </p>
                  <p className="text-sm text-[#333333]/70">
                    {topSalesItem.salesCount} units sold
                  </p>
                </>
              )}
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Quick actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="px-3 space-y-4">
                <div className="w-10 h-10 bg-[#1B7339]/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#1B7339]" />
                </div>
                <div className="flex items-center gap-3 mb-4">

                  <div>
                    <h4 className="font-medium">Real-Time Dashboard</h4>
                    <p className="text-sm text-gray-600">Live inventory insights and analytics</p>
                  </div>
                </div>
                <Link href="/dashboard" className="cursor-pointer">
                  <Button className="w-full bg-[#1B7339] hover:bg-[#1B7339]/80 cursor-pointer">Get started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="px-3 space-y-4">
              <div className="w-10 h-10 bg-[#1b7339]/10 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#1b7339]" />
                  </div>
                <div className="flex items-center gap-3 mb-4">
                 
                  <div>
                    <h4 className="font-medium">Inventory</h4>
                    <p className="text-sm text-gray-600">Add, edit or view products</p>
                  </div>
                </div>
                <Link href="/inventory" className="cursor-pointer">
                  <Button className="w-full bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer">Get started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="px-3 space-y-4">
              <div className="w-10 h-10 bg-[#1B7339]/10 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-[#1B7339]" />
                  </div>
                <div className="flex items-center gap-3 mb-4">
                  
                  <div>
                    <h4 className="font-medium">Sales</h4>
                    <p className="text-sm text-gray-600">Enter daily sales quickly</p>
                  </div>
                </div>
                <Link href="/sales" className="cursor-pointer">
                  <Button className="w-full bg-[#1B7339] hover:bg-[#1B7339]/80 cursor-pointer">Get started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="px-3 space-y-4">
              <div className="w-10 h-10 bg-[#1B7339]/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#1B7339]" />
                  </div>
                <div className="flex items-center gap-3 mb-4">
                  
                  <div>
                    <h4 className="font-medium">Reports</h4>
                    <p className="text-sm text-gray-600">Sales history and trends</p>
                  </div>
                </div>
                <Link href="/reports" className="cursor-pointer">
                  <Button className="w-full bg-[#1B7339] hover:bg-[#1B7339]/80 cursor-pointer">Get started</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
