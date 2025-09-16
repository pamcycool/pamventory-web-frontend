"use client"
import React from "react"
import { PageHeader } from "@/app/[locale]/(dashboard)/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, AlertTriangle, BarChart3, FileText, TrendingUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronUp } from "lucide-react"
import { useSales } from "@/hooks/use-sales-api"
import { useInventoryStats, useLowStockAlerts } from "@/hooks/use-inventory-api"
import { formatCurrency, isToday } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useTranslations } from "next-intl"

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

// Colors for charts
const COLORS = ['#1b7339', '#034FC8', '#ff4c48', '#A631CA', '#eed202', '#ff6b35', '#4ecdc4', '#45b7d1']

export default function DashboardPage() {
    const t = useTranslations('Dashboard')
    
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
        const salesData = recentSales?.data?.data
        if (!Array.isArray(salesData)) return { totalRevenue: 0, totalSales: 0 }
        
        const todaysData = salesData.filter((sale: SaleData) => isToday(sale.saleDate))
        return {
            totalRevenue: todaysData.reduce((sum: number, sale: SaleData) => sum + sale.totalPrice, 0),
            totalSales: todaysData.length
        }
    }, [recentSales])

    // Process data for charts
    const chartData = React.useMemo(() => {
        const salesData = recentSales?.data?.data
        if (!Array.isArray(salesData)) return { topProducts: [], dailySales: [], revenueByProduct: [] }

        // Top products by revenue
        const productRevenue = salesData.reduce((acc: { [key: string]: number }, sale: SaleData) => {
            acc[sale.productName] = (acc[sale.productName] || 0) + sale.totalPrice
            return acc
        }, {})

        const topProducts = Object.entries(productRevenue)
            .map(([name, revenue]) => ({ name, revenue: revenue as number }))
            .sort((a, b) => (b.revenue as number) - (a.revenue as number))
            .slice(0, 5)

        // Daily sales for the last 7 days
        const dailySales = []
        for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            
            const daySales = salesData.filter((sale: SaleData) => 
                sale.saleDate.startsWith(dateStr)
            )
            
            const totalRevenue = daySales.reduce((sum: number, sale: SaleData) => sum + sale.totalPrice, 0)
            dailySales.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: totalRevenue,
                sales: daySales.length
            })
        }

        // Revenue by product for pie chart
        const revenueByProduct = Object.entries(productRevenue)
            .map(([name, revenue]) => ({ name, value: revenue as number }))
            .sort((a, b) => (b.value as number) - (a.value as number))
            .slice(0, 6)

        return { topProducts, dailySales, revenueByProduct }
    }, [recentSales])

    const isLoadingMainStats = isLoadingSales || isLoadingInventory || isLoadingLowStock

    return (
        <div className="min-h-screen">
            <PageHeader
                title={t('Dashboard')}
                bannerTitle={t('Inventory Dashboard')}
                bannerSubtitle={t('Dashboard Subtitle')}
            />

            <div className="p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#1b7339]">
                        <div className="bg-[#1b7339]/10 rounded-full size-7 flex items-center justify-center">
                            <ShoppingCart className="text-[#1b7339] size-4" />
                        </div>
                        <p className="text-sm text-[#333333]/70">{t("Today's sales")}</p>
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
                                        {todaysSales.totalSales} {t('Transactions')}
                                    </p>
                                </>
                            )}
                        </div>
                    </Card>

                    <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#034FC8]">
                        <div className="bg-[#034FC8]/10 rounded-full size-7 flex items-center justify-center">
                            <FileText className="text-[#034FC8] size-4" />
                        </div>
                        <p className="text-sm text-[#333333]/70">{t('Total products')}</p>
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
                                    <p className="text-sm text-[#333333]/70">{t('Products')} in inventory</p>
                                </>
                            )}
                        </div>
                    </Card>

                    <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#eed202]">
                        <div className="bg-[#eed202]/10 rounded-full size-7 flex items-center justify-center">
                            <AlertTriangle className="text-[#eed202] size-4" />
                        </div>
                        <p className="text-sm text-[#333333]/70">{t('Low stock alerts')}</p>
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
                                    <p className="text-sm text-[#333333]/70">{t('Alerts')}</p>
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Daily Sales Trend */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-[#1b7339]" />
                                Daily Sales Trend (Last 7 Days)
                            </h3>
                            {isLoadingSales ? (
                                <div className="h-64 flex items-center justify-center">
                                    <Skeleton className="h-48 w-full" />
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={chartData.dailySales}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip 
                                            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                                            labelFormatter={(label) => `Date: ${label}`}
                                        />
                                        <Legend />
                                        <Line 
                                            type="monotone" 
                                            dataKey="revenue" 
                                            stroke="#1b7339" 
                                            strokeWidth={3}
                                            dot={{ fill: '#1b7339', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Revenue by Product (Pie Chart) */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-[#034FC8]" />
                                Revenue by Product
                            </h3>
                            {isLoadingSales ? (
                                <div className="h-64 flex items-center justify-center">
                                    <Skeleton className="h-48 w-full" />
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={chartData.revenueByProduct}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {chartData.revenueByProduct.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Top Products Bar Chart */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#ff4c48]" />
                            Top Products by Revenue
                        </h3>
                        {isLoadingSales ? (
                            <div className="h-64 flex items-center justify-center">
                                <Skeleton className="h-48 w-full" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData.topProducts}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                                    />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#ff4c48" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
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
