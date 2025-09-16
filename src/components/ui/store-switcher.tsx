"use client"

import React, { useState } from 'react'
import { useStore } from '@/contexts/store-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Store, Plus } from 'lucide-react'
import { CreateStoreModal } from '@/components/modals/CreateStoreModal'

export function StoreSwitcher() {
  const { activeStore, userStores, switchStore, isLoading } = useStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleStoreSwitch = async (storeId: string) => {
    try {
      await switchStore(storeId)
    } catch (error) {
      console.error('Failed to switch store:', error)
    }
  }

  if (!activeStore) {
    return null
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-left font-normal"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              <span className="truncate">{activeStore.name}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Switch Store</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {userStores.map((store) => (
            <DropdownMenuItem
              key={store._id}
              onClick={() => handleStoreSwitch(store._id)}
              className={`cursor-pointer ${
                store._id === activeStore._id ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{store.name}</span>
                  {store.description && (
                    <span className="text-xs text-muted-foreground truncate">
                      {store.description}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsCreateModalOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Store
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateStoreModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  )
}
