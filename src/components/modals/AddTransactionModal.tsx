"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AddTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerName?: string
  onSubmit?: (data: TransactionData) => void
}

interface TransactionData {
  type: string
  amount: string
  description: string
  dueDate?: Date
}

export function AddTransactionModal({
  open,
  onOpenChange,
  customerName = "Pamela",
  onSubmit,
}: AddTransactionModalProps) {
  const [formData, setFormData] = useState<TransactionData>({
    type: "",
    amount: "",
    description: "",
    dueDate: undefined,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    setFormData({ type: "", amount: "", description: "", dueDate: undefined })
    onOpenChange(false)
  }

  const handleCancel = () => {
    setFormData({ type: "", amount: "", description: "", dueDate: undefined })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="backdrop-blur-lg bg-black/50" />
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-white border-0 shadow-2xl" showCloseButton={false}>

        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-center text-lg font-medium">Add transaction for {customerName}</DialogTitle>
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
              <Label htmlFor="transaction-type">Transaction type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Credit given" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-given">Credit given</SelectItem>
                  <SelectItem value="payment-received">Payment received</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What was paid or bought for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[80px] resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Due date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#1b7339] hover:bg-[#1b7339]/80 cursor-pointer rounded-lg">
              Add transaction
            </Button>
          </div>
        </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
