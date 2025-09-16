"use client"

import React, { useState } from 'react'
import { useStore } from '@/contexts/store-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store, Plus, Edit, Trash2, Check } from 'lucide-react'
import { CreateStoreModal } from '@/components/modals/CreateStoreModal'
import { toast } from 'sonner'

export default function StoresPage() {
  const { userStores, activeStore, switchStore, deleteStore, isLoading } = useStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleSwitchStore = async (storeId: string) => {
    try {
      await switchStore(storeId)
      toast.success('Store switched successfully!')
    } catch (error) {
      console.error('Failed to switch store:', error)
    }
  }

  const handleDeleteStore = async (storeId: string, storeName: string) => {
    if (userStores.length === 1) {
      toast.error('Cannot delete your only store. Please create another store first.')
      return
    }

    if (confirm(`Are you sure you want to delete "${storeName}"? This action cannot be undone.`)) {
      try {
        await deleteStore(storeId)
        toast.success('Store deleted successfully!')
      } catch (error) {
        console.error('Failed to delete store:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Stores</h1>
          <p className="text-gray-600 mt-2">
            Manage your stores and switch between them
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Store
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading stores...</p>
          </div>
        </div>
      ) : userStores.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Store className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No stores yet</h3>
            <p className="text-gray-600 text-center mb-6">
              Create your first store to get started with PAMVENTORY
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Store
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userStores.map((store) => (
            <Card key={store._id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                      {store._id === activeStore?._id && (
                        <Badge variant="default" className="mt-1">
                          <Check className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {store.description && (
                  <CardDescription>{store.description}</CardDescription>
                )}
                
                <div className="space-y-2 text-sm text-gray-600">
                  {store.address && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Address:</span>
                      <span>{store.address}</span>
                    </div>
                  )}
                  {store.phone && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Phone:</span>
                      <span>{store.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  {store._id !== activeStore?._id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSwitchStore(store._id)}
                      className="flex-1"
                    >
                      Switch to Store
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement edit store functionality
                      toast.info('Edit store functionality coming soon!')
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteStore(store._id, store.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateStoreModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
