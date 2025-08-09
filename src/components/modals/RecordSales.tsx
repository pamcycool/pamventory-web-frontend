"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Minus, Plus, X, Loader2 } from "lucide-react"
import { useProducts, type Product as InventoryProduct } from "@/hooks/use-inventory-api"
import { useCreateSale } from "@/hooks/use-sales-api"
import { toast } from "sonner"

interface RecordSalesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ProductsResponse {
  data: {
    products: InventoryProduct[]
    pagination?: {
      currentPage: number
      totalPages: number
      totalProducts: number
      hasNextPage: boolean
      hasPrevPage: boolean
      limit: number
    }
  }
}



export function RecordSalesModal({ open, onOpenChange }: RecordSalesModalProps) {
  const [selectedProductId, setSelectedProductId] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [customPrice, setCustomPrice] = useState("")
  const [useCustomPrice, setUseCustomPrice] = useState(false)

  const createSale = useCreateSale()

  // Get products data
  const { data: productsResponse, isLoading: productsLoading } = useProducts({
    limit: 1000, // Get all products for dropdown
  })

  const products = (productsResponse as ProductsResponse)?.data?.products || []
  const availableProducts = products.filter((product: InventoryProduct) => product.currentQuantity > 0)

  const selectedProduct = availableProducts.find((p: InventoryProduct) => p._id === selectedProductId)
  const unitPrice = useCustomPrice ? Number(customPrice) || 0 : selectedProduct?.price || 0
  const total = unitPrice * quantity

  const maxQuantity = selectedProduct?.currentQuantity || 0

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setSelectedProductId("")
      setQuantity(1)
      setCustomPrice("")
      setUseCustomPrice(false)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProductId || !selectedProduct) {
      toast.error("Please select a product")
      return
    }

    if (quantity > maxQuantity) {
      toast.error(`Insufficient stock. Available: ${maxQuantity}`)
      return
    }

    if (unitPrice <= 0) {
      toast.error("Unit price must be greater than 0")
      return
    }

    try {
      await createSale.mutateAsync({
        productId: selectedProductId,
        quantity,
        unitPrice,
        paymentMethod: "cash" // Default payment method
      })

      toast.success("Sale recorded successfully!")
      onOpenChange(false)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error && 
        typeof error.response === 'object' && error.response !== null &&
        'data' in error.response && typeof error.response.data === 'object' &&
        error.response.data !== null && 'message' in error.response.data
        ? String(error.response.data.message)
        : "Failed to record sale"
      toast.error(errorMessage)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, maxQuantity))
  }
  
  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleQuantityChange = (value: string) => {
    const numValue = Number.parseInt(value) || 1
    setQuantity(Math.min(Math.max(1, numValue), maxQuantity))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="backdrop-blur-lg bg-black/50" />
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-white border-0 shadow-2xl" showCloseButton={false}>

        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-center text-lg font-medium">Record sales</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-6 w-6"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product">Select product</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId} disabled={productsLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={productsLoading ? "Loading..." : "-Select-"} />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product: InventoryProduct) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name} (Stock: {product.currentQuantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableProducts.length === 0 && !productsLoading && (
                <p className="text-sm text-red-600">No products with stock available</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Quantity sold</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 bg-transparent"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="text-center"
                  min="1"
                  max={maxQuantity}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 bg-transparent"
                  onClick={incrementQuantity}
                  disabled={quantity >= maxQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {selectedProduct && (
                <p className="text-xs text-gray-500">Max available: {maxQuantity}</p>
              )}
            </div>
          </div>

          {selectedProduct && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Use custom price</Label>
                <input
                  type="checkbox"
                  checked={useCustomPrice}
                  onChange={(e) => setUseCustomPrice(e.target.checked)}
                  className="rounded"
                />
              </div>
              {useCustomPrice && (
                <Input
                  type="number"
                  placeholder="Enter custom price"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Review</Label>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Product:</span>
                <span>{selectedProduct?.name || "None selected"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Unit price:</span>
                <span>₦ {unitPrice.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quantity:</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total:</span>
                <span>₦ {total.toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer rounded-lg" 
              disabled={!selectedProductId || createSale.isPending || productsLoading}
            >
              {createSale.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                "Record sale"
              )}
            </Button>
          </div>
        </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
