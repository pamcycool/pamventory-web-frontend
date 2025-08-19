"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { useCreateProduct } from "@/hooks/use-inventory-api"
import { toast } from "sonner"

interface AddProductModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit?: (data: ProductData) => void
}

interface ProductData {
    name: string
    price: string
    initialQuantity: string
    restockLevel: string
    photo?: File
}

export function AddProductModal({ open, onOpenChange, onSubmit }: AddProductModalProps) {
    const [formData, setFormData] = useState<ProductData>({
        name: "",
        price: "",
        initialQuantity: "",
        restockLevel: "",
    })
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    
    const createProductMutation = useCreateProduct()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const productData = { 
            ...formData, 
            photo: photoFile || undefined 
        }
        
        try {
            await createProductMutation.mutateAsync(productData)
            
            toast.success("Product added successfully!")
            setFormData({ name: "", price: "", initialQuantity: "", restockLevel: "" })
            setPhotoFile(null)
            onOpenChange(false)
            onSubmit?.(productData)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add product")
        }
    }

    const handleCancel = () => {
        setFormData({ name: "", price: "", initialQuantity: "", restockLevel: "" })
        setPhotoFile(null)
        onOpenChange(false)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPhotoFile(file)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="backdrop-blur-lg bg-black/50" />
                <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-white border-0 shadow-2xl" showCloseButton={false}>

                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle className="text-center text-lg font-medium">Add new product</DialogTitle>

                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="product-name">Product name</Label>
                            <Input
                                id="product-name"
                                placeholder="e.g. Rice 50 kg bag"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₦)</Label>
                            <Input
                                id="price"
                                placeholder="e.g. ₦15,000"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="initial-quantity">Initial quantity</Label>
                            <Input
                                id="initial-quantity"
                                placeholder="e.g. 50"
                                value={formData.initialQuantity}
                                onChange={(e) => setFormData({ ...formData, initialQuantity: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="restock-level">Restock alert level</Label>
                            <Input
                                id="restock-level"
                                placeholder="e.g. 10"
                                value={formData.restockLevel}
                                onChange={(e) => setFormData({ ...formData, restockLevel: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Product photo (Optional)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="photo-upload" />
                            <label htmlFor="photo-upload" className="cursor-pointer">
                                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">{photoFile ? photoFile.name : "Click to upload photo"}</p>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="flex-1 bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer rounded-lg"
                            disabled={createProductMutation.isPending}
                        >
                            {createProductMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "Add product"
                            )}
                        </Button>
                    </div>
                </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
