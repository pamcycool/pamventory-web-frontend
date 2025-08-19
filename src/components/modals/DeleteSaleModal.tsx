"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"
import { type Sale } from "@/hooks/use-sales-api"

interface DeleteSaleModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    sale: Sale | null
    onConfirm: () => void
    isDeleting: boolean
}

export function DeleteSaleModal({ 
    open, 
    onOpenChange, 
    sale, 
    onConfirm, 
    isDeleting 
}: DeleteSaleModalProps) {
    if (!sale) return null

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="backdrop-blur-lg bg-black/50" />
                <DialogContent className="sm:max-w-[400px] p-0 gap-0 bg-white border-0 shadow-2xl" showCloseButton={false}>
                    <DialogHeader className="p-6 pb-4 border-b">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-medium text-left">Delete Sale Record</DialogTitle>
                                <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-6">
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Product:</span>
                                    <span className="font-medium">{sale.productName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Quantity:</span>
                                    <span className="font-medium">{sale.quantity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total:</span>
                                    <span className="font-medium">₦ {sale.totalPrice.toLocaleString()}.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="font-medium">{formatDate(sale.saleDate)}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this sale record? This will permanently remove the sale and 
                            <span className="font-medium text-gray-900"> restore {sale.quantity} units</span> to your inventory.
                        </p>

                        <div className="flex gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="flex-1" 
                                onClick={() => onOpenChange(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="button" 
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={onConfirm}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete Sale"
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}