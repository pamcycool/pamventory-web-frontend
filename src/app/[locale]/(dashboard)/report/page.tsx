"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/app/[locale]/(dashboard)/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, TrendingUp, ChevronUp, FileText, Loader2 } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useSalesStats, useSales } from "@/hooks/use-sales-api"

// Define interfaces for proper typing
interface AxiosResponse<T> {
    data: T
    status: number
    statusText: string
    headers: unknown
    config: unknown
    request: unknown
}

// Helper function to format currency
const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(0)
    }
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(amount)
}

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })
}

// Helper function to get date range based on period
const getDateRange = (period: string) => {
    const now = new Date()
    // Set end date to end of today
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString()
    let startDate: string
    
    switch (period) {
        case '7days':
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            startDate = new Date(sevenDaysAgo.getFullYear(), sevenDaysAgo.getMonth(), sevenDaysAgo.getDate(), 0, 0, 0, 0).toISOString()
            break
        case '30days':
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            startDate = new Date(thirtyDaysAgo.getFullYear(), thirtyDaysAgo.getMonth(), thirtyDaysAgo.getDate(), 0, 0, 0, 0).toISOString()
            break
        case '90days':
            const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
            startDate = new Date(ninetyDaysAgo.getFullYear(), ninetyDaysAgo.getMonth(), ninetyDaysAgo.getDate(), 0, 0, 0, 0).toISOString()
            break
        case '1year':
            const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            startDate = new Date(oneYearAgo.getFullYear(), oneYearAgo.getMonth(), oneYearAgo.getDate(), 0, 0, 0, 0).toISOString()
            break
        default:
            const defaultSevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            startDate = new Date(defaultSevenDaysAgo.getFullYear(), defaultSevenDaysAgo.getMonth(), defaultSevenDaysAgo.getDate(), 0, 0, 0, 0).toISOString()
    }
    
    return { startDate, endDate }
}

export default function ReportPage() {
    const [reportType, setReportType] = useState("daily")
    const [period, setPeriod] = useState("7days")

    // Calculate date range based on period
    const { startDate, endDate } = useMemo(() => getDateRange(period), [period])

    // Map report type to API period parameter
    const apiPeriod = useMemo(() => {
        switch (reportType) {
            case 'daily': return 'day'
            case 'weekly': return 'week'
            case 'monthly': return 'month'
            case 'yearly': return 'month' // Use month for yearly but with wider date range
            default: return 'day'
        }
    }, [reportType])

    // Fetch sales statistics
    const { data: statsData, isLoading: statsLoading, error: statsError } = useSalesStats(
        startDate,
        endDate,
        apiPeriod
    )

    // Fetch recent sales for the table
    const { data: salesData, isLoading: salesLoading, error: salesError } = useSales({
        page: 1,
        limit: 10,
        sortBy: 'saleDate',
        sortOrder: 'desc',
        startDate,
        endDate
    })

    const stats = (statsData as AxiosResponse<{data: {
        overview?: {
            totalRevenue?: number;
            totalSales?: number;
            totalQuantitySold?: number;
            averageSaleValue?: number;
        };
        topProducts?: Array<{
            _id: string;
            productName: string;
            salesCount: number;
            totalQuantitySold: number;
            totalRevenue: number;
        }>;
    }}>)?.data?.data
    const recentSales = Array.isArray((salesData as AxiosResponse<{data: Array<{
        _id: string;
        saleDate?: string;
        createdAt: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        paymentMethod: string;
    }>}>)?.data?.data) ? (salesData as AxiosResponse<{data: Array<{
        _id: string;
        saleDate?: string;
        createdAt: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        paymentMethod: string;
    }>}>).data.data : []

    // Debug logging (can be removed in production)
    console.log('Stats overview:', stats?.overview)
    console.log('Top products:', stats?.topProducts)
    console.log('Recent sales count:', recentSales?.length)
    return (
        <div className="min-h-screen">
            <PageHeader
                title="Report"
                bannerTitle="Report period"
                bannerSubtitle="View your reports weekly, monthly or yearly"
            />

            <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Report type</label>
                        <Select value={reportType} onValueChange={setReportType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily reports</SelectItem>
                                <SelectItem value="weekly">Weekly reports</SelectItem>
                                <SelectItem value="monthly">Monthly reports</SelectItem>
                                <SelectItem value="yearly">Yearly reports</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">Last 7 days</SelectItem>
                                <SelectItem value="30days">Last 30 days</SelectItem>
                                <SelectItem value="90days">Last 90 days</SelectItem>
                                <SelectItem value="1year">Last year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Loading state for statistics */}
                {statsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i} className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-gray-200">
                                <div className="flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                </div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                            </Card>
                        ))}
                    </div>
                ) : statsError ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="col-span-full p-6 text-center text-red-600">
                            <p>Error loading statistics. Please try again.</p>
                        </Card>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#1b7339]">
                            <div className="bg-[#1b7339]/10 rounded-full size-7 flex items-center justify-center">
                                <p className="text-[#1b7339]">#</p>
                            </div>
                            <p className="text-sm text-[#333333]/70">Total revenue</p>
                            <div className="flex justify-between items-center">
                                <p className="text-base text-[#333333]">
                                    {formatCurrency(stats?.overview?.totalRevenue || 0)}
                                </p>
                            </div>
                        </Card>

                        <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#034FC8]">
                            <div className="bg-[#034FC8]/10 rounded-full size-7 flex items-center justify-center">
                                <FileText className="text-[#034FC8] size-4" />
                            </div>
                            <p className="text-sm text-[#333333]/70">Total transactions</p>
                            <div className="flex justify-between items-center">
                                <p className="text-base text-[#333333]">
                                    {stats?.overview?.totalSales || 0}
                                </p>
                            </div>
                        </Card>

                        <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#ff4c48]">
                            <div className="bg-[#ff4c48]/10 rounded-full size-7 flex items-center justify-center">
                                <ShoppingCart className="text-[#ff4c48] size-4" />
                            </div>
                            <p className="text-sm text-[#333333]/70">Total quantity sold</p>
                            <div className="flex justify-between items-center">
                                <p className="text-base text-[#333333]">
                                    {stats?.overview?.totalQuantitySold || 0} units
                                </p>
                            </div>
                        </Card>

                        <Card className="p-3 flex flex-col gap-4 border-t-6 border-l-0 border-r-0 border-b-0 border-[#A631CA]">
                            <div className="bg-[#A631CA]/10 rounded-full size-7 flex items-center justify-center">
                                <TrendingUp className="text-[#A631CA] size-4" />
                            </div>
                            <p className="text-sm text-[#333333]/70">Average transaction value</p>
                            <div className="flex justify-between items-center">
                                <p className="text-base text-[#333333]">
                                    {formatCurrency(stats?.overview?.averageSaleValue || 0)}
                                </p>
                            </div>
                        </Card>
                    </div>
                )}

                <Collapsible defaultOpen className="mb-8">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:bg-gray-50">
                        <h3 className="text-lg font-medium">Top selling products</h3>
                        <ChevronUp className="w-5 h-5" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Card className="mt-2 p-1">
                            <CardContent className="p-0">
                                {statsLoading ? (
                                    <div className="p-6 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Loading top products...</p>
                                    </div>
                                ) : statsError ? (
                                    <div className="p-6 text-center text-red-600">
                                        <p>Error loading top products</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b">
                                                <tr>
                                                    <th className="text-left p-4 font-medium text-gray-600">Product name</th>
                                                    <th className="text-left p-4 font-medium text-gray-600">Number of sales</th>
                                                    <th className="text-left p-4 font-medium text-gray-600">Total quantity sold</th>
                                                    <th className="text-left p-4 font-medium text-gray-600">Total revenue</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats?.topProducts && stats.topProducts.length > 0 ? (
                                                    stats.topProducts.map((product: { _id: string; productName: string; salesCount: number; totalQuantitySold: number; totalRevenue: number }) => (
                                                        <tr key={product._id} className="border-b hover:bg-gray-50">
                                                            <td className="p-4 text-sm">{product.productName}</td>
                                                            <td className="p-4 text-sm">{product.salesCount}</td>
                                                            <td className="p-4 text-sm">{product.totalQuantitySold} units</td>
                                                            <td className="p-4 text-sm">{formatCurrency(product.totalRevenue)}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="p-6 text-center text-gray-500">
                                                            No sales data available for the selected period
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white rounded-lg border hover:bg-gray-50">
                        <h3 className="text-lg font-medium">Recent sales</h3>
                        <ChevronUp className="w-5 h-5" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Card className="mt-2 p-1">
                            <CardContent className="p-0">
                                {salesLoading ? (
                                    <div className="p-6 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Loading recent sales...</p>
                                    </div>
                                ) : salesError ? (
                                    <div className="p-6 text-center text-red-600">
                                        <p>Error loading recent sales</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 border-b">
                                                    <tr>
                                                        <th className="text-left p-4 font-medium text-gray-600">Date & time</th>
                                                        <th className="text-left p-4 font-medium text-gray-600">Product name</th>
                                                        <th className="text-left p-4 font-medium text-gray-600">Quantity sold</th>
                                                        <th className="text-left p-4 font-medium text-gray-600">Unit Price</th>
                                                        <th className="text-left p-4 font-medium text-gray-600">Total Price</th>
                                                        <th className="text-left p-4 font-medium text-gray-600">Payment Method</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recentSales && recentSales.length > 0 ? (
                                                        recentSales.map((sale: { _id: string; saleDate?: string; createdAt: string; productName: string; quantity: number; unitPrice: number; totalPrice: number; paymentMethod: string }) => (
                                                            <tr key={sale._id} className="border-b hover:bg-gray-50">
                                                                <td className="p-4 text-sm">{formatDate(sale.saleDate || sale.createdAt)}</td>
                                                                <td className="p-4 text-sm">{sale.productName}</td>
                                                                <td className="p-4 text-sm">{sale.quantity} units</td>
                                                                <td className="p-4 text-sm">{formatCurrency(sale.unitPrice)}</td>
                                                                <td className="p-4 text-sm">{formatCurrency(sale.totalPrice)}</td>
                                                                <td className="p-4 text-sm">
                                                                    <span className="capitalize">{sale.paymentMethod}</span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={6} className="p-6 text-center text-gray-500">
                                                                No sales found for the selected period
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {recentSales && recentSales.length > 0 && (
                                            <div className="flex items-center justify-between p-4 border-t">
                                                <p className="text-sm text-gray-500">
                                                    Showing latest {recentSales.length} sales
                                                </p>
                                                <Button variant="outline" size="sm">
                                                    View all sales
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    )
}
