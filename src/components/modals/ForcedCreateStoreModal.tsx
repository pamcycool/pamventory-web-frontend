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
import { Store, Building2, MapPin, Phone, AlertCircle, Lock } from 'lucide-react'
import { toast } from 'sonner'

interface ForcedCreateStoreModalProps {
  isOpen: boolean
}

export function ForcedCreateStoreModal({ isOpen }: ForcedCreateStoreModalProps) {
  const { createStore, isLoading } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      toast.success('Store created successfully! Welcome to PAMVENTORY!')
    } catch (error) {
      console.error('Failed to create store:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Your Store</h2>
              <p className="text-sm text-gray-600">Required to continue</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-amber-600">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-medium">REQUIRED</span>
          </div>
        </div>

        {/* Warning */}
        <div className="p-4 bg-amber-50 border-b border-amber-200">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Setup Required</span>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            You must create a store to use PAMVENTORY. This step cannot be skipped.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Store Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter your store name"
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
              placeholder="Tell us about your store (optional)"
              {...register('description')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </Label>
            <Input
              id="address"
              placeholder="Enter store address (optional)"
              {...register('address')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="Enter phone number (optional)"
              {...register('phone')}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Creating Store...' : 'Create Store & Continue'}
          </Button>
        </form>

        <div className="p-4 bg-gray-50 border-t text-center">
          <p className="text-xs text-gray-500">
            You can add more stores later from your dashboard
          </p>
        </div>
      </div>
    </div>
  )
}
