"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, Edit, Trash2, Calendar, Tag, BarChart3 } from "lucide-react"
import { type Product } from "@/hooks/use-inventory-api"
import Image from "next/image"

interface ProductDetailsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: Product | null
    onEdit: () => void
    onDelete: () => void
}

export function ProductDetailsModal({ 
    open, 
    onOpenChange, 
    product, 
    onEdit, 
    onDelete 
}: ProductDetailsModalProps) {
    if (!product) return null

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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(price)
    }

    const getStockBadge = () => {
        if (product.currentQuantity === 0) {
            return <Badge variant="destructive" className="gap-1"><Package className="w-3 h-3" />Out of Stock</Badge>
        } else if (product.isLowStock) {
            return <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3" />Low Stock</Badge>
        } else {
            return <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800"><Package className="w-3 h-3" />In Stock</Badge>
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="backdrop-blur-lg bg-black/50" />
                <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white border-0 shadow-2xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
                    <DialogHeader className="p-6 pb-4 border-b">
                        <div className="flex items-start justify-between">
                            <div>
                                <DialogTitle className="text-xl font-semibold text-left mb-2">{product.name}</DialogTitle>
                                <div className="flex items-center gap-2">
                                    {getStockBadge()}
                                    <Badge variant="outline" className="text-xs">{product.category}</Badge>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={onEdit}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={onDelete}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-6 space-y-6">
                        {/* Product Image */}
                        {product.photo && (
                            <div className="flex justify-center">
                                <div className="relative w-48 h-48 rounded-lg overflow-hidden border">
                                    <Image
                                        src={product.photo}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="192px"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Price */}
                        <div className="text-center">
                            <div className="text-3xl font-bold text-[#1b7339]">{formatPrice(product.price)}</div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{product.currentQuantity}</div>
                                <div className="text-sm text-gray-500">Current Stock</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">{product.restockLevel}</div>
                                <div className="text-sm text-gray-500">Alert Level</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{product.totalSold}</div>
                                <div className="text-sm text-gray-500">Total Sold</div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-gray-400" />
                                <div>
                                    <div className="text-sm font-medium">Initial Quantity</div>
                                    <div className="text-sm text-gray-500">{product.initialQuantity} units</div>
                                </div>
                            </div>

                            {product.sku && (
                                <div className="flex items-center gap-3">
                                    <Tag className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm font-medium">SKU</div>
                                        <div className="text-sm text-gray-500 font-mono">{product.sku}</div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <div className="text-sm font-medium">Last Restocked</div>
                                    <div className="text-sm text-gray-500">{formatDate(product.lastRestocked)}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <div className="text-sm font-medium">Created</div>
                                    <div className="text-sm text-gray-500">{formatDate(product.createdAt)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div>
                                <div className="text-sm font-medium mb-2">Description</div>
                                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                                    {product.description}
                                </div>
                            </div>
                        )}

                        {/* Stock Status Warning */}
                        {product.isLowStock && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                    <div className="text-sm font-medium text-yellow-800">Low Stock Alert</div>
                                </div>
                                <div className="text-sm text-yellow-700 mt-1">
                                    This product is running low. Consider restocking soon.
                                </div>
                            </div>
                        )}

                        {product.currentQuantity === 0 && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-red-600" />
                                    <div className="text-sm font-medium text-red-800">Out of Stock</div>
                                </div>
                                <div className="text-sm text-red-700 mt-1">
                                    This product is currently out of stock.
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <Button 
                                variant="outline" 
                                className="w-full" 
                                onClick={() => onOpenChange(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}