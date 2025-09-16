"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createStoreSchema, CreateStoreData } from '@/lib/validations'
import { useStore } from '@/contexts/store-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface CreateStoreModalProps {
  isOpen: boolean
  onClose: () => void
  isFirstStore?: boolean
}

export function CreateStoreModal({ isOpen, onClose, isFirstStore = false }: CreateStoreModalProps) {
  const { createStore, isLoading } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateStoreData>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      phone: '',
    },
  })

  const onSubmit = async (data: CreateStoreData) => {
    try {
      setIsSubmitting(true)
      await createStore(data)
      toast.success('Store created successfully!')
      reset()
      onClose()
    } catch (error) {
      console.error('Failed to create store:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      reset()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isFirstStore ? 'Create Your First Store' : 'Create New Store'}
          </DialogTitle>
          <DialogDescription>
            {isFirstStore 
              ? 'Welcome! Let\'s set up your first store to get started.'
              : 'Add a new store to your account.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              placeholder="Enter store name"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter store description (optional)"
              {...register('description')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter store address (optional)"
              {...register('address')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter phone number (optional)"
              {...register('phone')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? 'Creating...' : isFirstStore ? 'Create Store' : 'Add Store'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
