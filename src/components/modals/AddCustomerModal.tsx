"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

interface AddCustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: CustomerData) => void
}

interface CustomerData {
  name: string
  phone: string
  address: string
}

export function AddCustomerModal({ open, onOpenChange, onSubmit }: AddCustomerModalProps) {
  const [formData, setFormData] = useState<CustomerData>({
    name: "",
    phone: "",
    address: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    setFormData({ name: "", phone: "", address: "" })
    onOpenChange(false)
  }

  const handleCancel = () => {
    setFormData({ name: "", phone: "", address: "" })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="backdrop-blur-lg bg-black/50" />
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-white border-0 shadow-2xl" showCloseButton={false}>

        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-center text-lg font-medium">Add customer</DialogTitle>
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
              <Label htmlFor="customer-name">Customer name</Label>
              <Input
                id="customer-name"
                placeholder="Enter customer name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone number</Label>
              <Input
                id="phone-number"
                placeholder="Enter customer phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter customer address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="min-h-[80px] resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer rounded-lg">
              Add customer
            </Button>
          </div>
        </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
