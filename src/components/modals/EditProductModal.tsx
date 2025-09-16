"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { useUpdateProduct, type Product } from "@/hooks/use-inventory-api"
import { toast } from "sonner"
import Image from "next/image"

interface EditProductModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: Product | null
}

interface ProductFormData {
    name: string
    price: string
    currentQuantity: string
    restockLevel: string
    category: string
    description: string
    sku: string
    photo?: File
}

export function EditProductModal({ open, onOpenChange, product }: EditProductModalProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        price: "",
        currentQuantity: "",
        restockLevel: "",
        category: "",
        description: "",
        sku: "",
    })
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    
    const updateProductMutation = useUpdateProduct()

    // Initialize form data when product changes
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price.toString(),
                currentQuantity: product.currentQuantity.toString(),
                restockLevel: product.restockLevel.toString(),
                category: product.category || "",
                description: product.description || "",
                sku: product.sku || "",
            })
            setPreviewUrl(product.photo || null)
        }
    }, [product])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!product) return

        const productData = { 
            ...formData, 
            photo: photoFile || undefined 
        }
        
        try {
            await updateProductMutation.mutateAsync({ 
                id: product._id, 
                productData 
            })
            
            toast.success("Product updated successfully!")
            handleClose()
        } catch (error: unknown) {
            const errorMessage = error && typeof error === 'object' && 'response' in error 
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
                : "Failed to update product";
            toast.error(errorMessage);
        }
    }

    const handleClose = () => {
        setFormData({
            name: "",
            price: "",
            currentQuantity: "",
            restockLevel: "",
            category: "",
            description: "",
            sku: "",
        })
        setPhotoFile(null)
        setPreviewUrl(null)
        onOpenChange(false)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPhotoFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    if (!product) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="backdrop-blur-lg bg-black/50" />
                <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white border-0 shadow-2xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
                    <DialogHeader className="p-6 pb-4 border-b">
                        <DialogTitle className="text-center text-lg font-medium">Edit Product</DialogTitle>
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
                                    type="number"
                                    placeholder="e.g. 15000"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-quantity">Current quantity</Label>
                                <Input
                                    id="current-quantity"
                                    type="number"
                                    placeholder="e.g. 50"
                                    value={formData.currentQuantity}
                                    onChange={(e) => setFormData({ ...formData, currentQuantity: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="restock-level">Restock alert level</Label>
                                <Input
                                    id="restock-level"
                                    type="number"
                                    placeholder="e.g. 10"
                                    value={formData.restockLevel}
                                    onChange={(e) => setFormData({ ...formData, restockLevel: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    placeholder="e.g. Grains"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU (Optional)</Label>
                                <Input
                                    id="sku"
                                    placeholder="e.g. RICE-50KG-001"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                                id="description"
                                placeholder="Product description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Product photo</Label>
                            {previewUrl && (
                                <div className="mb-4">
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                                        <Image
                                            src={previewUrl}
                                            alt="Product preview"
                                            fill
                                            className="object-cover"
                                            sizes="128px"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="photo-upload" />
                                <label htmlFor="photo-upload" className="cursor-pointer">
                                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">
                                        {photoFile ? photoFile.name : "Click to upload new photo"}
                                    </p>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="flex-1 bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer rounded-lg"
                                disabled={updateProductMutation.isPending}
                            >
                                {updateProductMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update product"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}