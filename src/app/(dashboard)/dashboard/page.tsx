"use client"
import React from "react"
import { PageHeader } from "@/app/(dashboard)/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, AlertTriangle, BarChart3, FileText } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronUp } from "lucide-react"
import { useSales } from "@/hooks/use-sales-api"
import { useInventoryStats, useLowStockAlerts } from "@/hooks/use-inventory-api"
import { formatCurrency, formatDate, isToday } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

type InventoryStatsData = {
    data?: {
        totalProducts?: number
    }
}

type LowStockData = {
    count?: number
}

type SaleData = {
    _id: string
    saleDate: string
    productName: string
    quantity: number
    unitPrice: number
    totalPrice: number
}

export default function DashboardPage() {
    // API hooks
    const { data: inventoryStats, isLoading: isLoadingInventory } = useInventoryStats()
    const { data: lowStockAlerts, isLoading: isLoadingLowStock } = useLowStockAlerts()
    const { data: recentSales, isLoading: isLoadingSales } = useSales({ 
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

    const isLoadingMainStats = isLoadingSales || isLoadingInventory || isLoadingLowStock
    return (
        <div className="min-h-screen">
            <PageHeader
                title="Dashboard"
                bannerTitle="Inventory Dashboard"
                bannerSubtitle="Refreshes automatically every 30 seconds with your real business data"
            />

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#1b7339]">
                        <div className="bg-[#1b7339]/10 rounded-full size-7 flex items-center justify-center">
                            <ShoppingCart className="text-[#1b7339] size-4" />
                        </div>
                        <p className="text-sm text-[#333333]/70">Today&apos;s sales</p>
                        <div className="flex justify-between items-center">
                            {isLoadingMainStats ? (
                                <>
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-3 w-20" />
                                </>
                            ) : (
                                <>
                                    <p className="text-base text-[#333333]">
                                        {formatCurrency(todaysSales.totalRevenue)}
                                    </p>
                                    <p className="text-sm text-[#333333]/70">
                                        {todaysSales.totalSales} Transactions
                                    </p>
                                </>
                            )}
                        </div>
                    </Card>

                    <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#034FC8]">
                        <div className="bg-[#034FC8]/10 rounded-full size-7 flex items-center justify-center">
                            <FileText className="text-[#034FC8] size-4" />
                        </div>
                        <p className="text-sm text-[#333333]/70">Total products</p>
                        <div className="flex justify-between items-center">
                            {isLoadingInventory ? (
                                <>
                                    <Skeleton className="h-4 w-8" />
                                    <Skeleton className="h-3 w-24" />
                                </>
                            ) : (
                                <>
                                    <p className="text-base text-[#333333]">
                                        {(inventoryStats as InventoryStatsData)?.data?.totalProducts || 0}
                                    </p>
                                    <p className="text-sm text-[#333333]/70">Products in inventory</p>
                                </>
                            )}
                        </div>
                    </Card>

                    <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#eed202]">
                        <div className="bg-[#eed202]/10 rounded-full size-7 flex items-center justify-center">
                            <AlertTriangle className="text-[#eed202] size-4" />
                        </div>
                        <p className="text-sm text-[#333333]/70">Low stock items</p>
                        <div className="flex justify-between items-center">
                            {isLoadingLowStock ? (
                                <>
                                    <Skeleton className="h-4 w-12" />
                                    <Skeleton className="h-3 w-20" />
                                </>
                            ) : (
                                <>
                                    <p className="text-base text-[#333333]">
                                        {(lowStockAlerts as LowStockData)?.count || 0}
                                    </p>
                                    <p className="text-sm text-[#333333]/70">Need attention</p>
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                <Collapsible defaultOpen className="mb-8">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:bg-gray-50">
                        <h3 className="text-lg font-medium">Transactions</h3>
                        <ChevronUp className="w-5 h-5" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Card className="mt-2 p-1">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="text-left p-4 font-medium text-gray-600">Date & time</th>
                                                <th className="text-left p-4 font-medium text-gray-600">Item</th>
                                                <th className="text-left p-4 font-medium text-gray-600">Quantity sold</th>
                                                <th className="text-left p-4 font-medium text-gray-600">Unit price</th>
                                                <th className="text-left p-4 font-medium text-gray-600">Total price</th>
                                                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLoadingSales ? (
                                                // Loading skeleton rows
                                                Array.from({ length: 5 }).map((_, index) => (
                                                    <tr key={index} className="border-b">
                                                        <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                                                        <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                                                        <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                                                        <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                                                        <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                                                        <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                                                    </tr>
                                                ))
                                            ) : recentSales?.data?.data?.length ? (
                                                recentSales.data.data.slice(0, 10).map((sale: SaleData) => (
                                                    <tr key={sale._id} className="border-b hover:bg-gray-50">
                                                        <td className="p-4 text-sm">{formatDate(sale.saleDate)}</td>
                                                        <td className="p-4 text-sm">{sale.productName}</td>
                                                        <td className="p-4 text-sm">{sale.quantity}</td>
                                                        <td className="p-4 text-sm">{formatCurrency(sale.unitPrice)}</td>
                                                        <td className="p-4 text-sm">{formatCurrency(sale.totalPrice)}</td>
                                                        <td className="p-4">
                                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                                Successful
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                                        No transactions found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:bg-gray-50">
                        <h3 className="text-lg font-medium">Quick actions</h3>
                        <ChevronUp className="w-5 h-5" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <Card>
                                <CardContent className="px-3 space-y-4">
                                    <div className="w-10 h-10 bg-[#1b7339]/10 rounded-lg flex items-center justify-center">
                                        <ShoppingCart className="w-5 h-5 text-[#1b7339]" />
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">

                                        <div>
                                            <h4 className="font-medium">Sales</h4>
                                            <p className="text-sm text-gray-600">Enter daily sales quickly</p>
                                        </div>
                                    </div>
                                    <Link href="/sales">
                                        <Button className="w-full bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer">Get started</Button>
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
                                    <Link href="/inventory">
                                        <Button className="w-full bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer">Get started</Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="px-3 space-y-4">
                                    <div className="w-10 h-10 bg-[#1b7339]/10 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-5 h-5 text-[#1b7339]" />
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">

                                        <div>
                                            <h4 className="font-medium">Reports</h4>
                                            <p className="text-sm text-gray-600">Sales history and trends</p>
                                        </div>
                                    </div>
                                    <Link href="/report">
                                        <Button className="w-full bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer">Get started</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    )
}
