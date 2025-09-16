"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"
import { type Product } from "@/hooks/use-inventory-api"

interface DeleteConfirmationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: Product | null
    onConfirm: () => void
    isDeleting: boolean
}

export function DeleteConfirmationModal({ 
    open, 
    onOpenChange, 
    product, 
    onConfirm, 
    isDeleting 
}: DeleteConfirmationModalProps) {
    if (!product) return null

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
                                <DialogTitle className="text-lg font-medium text-left">Delete Product</DialogTitle>
                                <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-6">
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete <span className="font-medium text-gray-900">&quot;{product.name}&quot;</span>? 
                            This will permanently remove the product from your inventory.
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
                                    "Delete Product"
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}