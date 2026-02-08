"use client"

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApiClient } from '@/lib/api/admin'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Shield, User, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface User {
  _id: string
  name: string
  email: string
  role: string
  isVerified: boolean
  subscriptionStatus: string
  lastLogin?: string
  createdAt: string
  stores?: any[]
}

interface UsersTableProps {
  users: User[]
  refetch: () => void
}

export function UsersTable({ users, refetch }: UsersTableProps) {
  const queryClient = useQueryClient()
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'User' | 'Admin' }) =>
      adminApiClient.updateUserRole(userId, role),
    onSuccess: () => {
      toast.success('User role updated successfully')
      refetch()
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user role')
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminApiClient.deleteUser(userId),
    onSuccess: () => {
      toast.success('User deleted successfully')
      refetch()
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      setDeletingUserId(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user')
      setDeletingUserId(null)
    },
  })

  const handleRoleChange = (userId: string, newRole: 'User' | 'Admin') => {
    updateRoleMutation.mutate({ userId, role: newRole })
  }

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setDeletingUserId(userId)
      deleteUserMutation.mutate(userId)
    }
  }

  const getSubscriptionBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'TRIAL':
        return <Badge className="bg-yellow-100 text-yellow-800">Trial</Badge>
      case 'EXPIRED':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Stores</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.role === 'Admin' ? (
                      <Shield className="h-4 w-4 text-purple-600" />
                    ) : (
                      <User className="h-4 w-4 text-gray-600" />
                    )}
                    <span>{user.role}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {user.isVerified ? (
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Unverified</Badge>
                  )}
                </TableCell>
                <TableCell>{getSubscriptionBadge(user.subscriptionStatus)}</TableCell>
                <TableCell>{user.stores?.length || 0}</TableCell>
                <TableCell>
                  {user.lastLogin
                    ? format(new Date(user.lastLogin), 'MMM dd, yyyy')
                    : 'Never'}
                </TableCell>
                <TableCell>{format(new Date(user.createdAt), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(user.email)}
                      >
                        Copy email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.role === 'User' ? (
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(user._id, 'Admin')}
                          disabled={updateRoleMutation.isPending}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Make Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(user._id, 'User')}
                          disabled={updateRoleMutation.isPending}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Remove Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={deleteUserMutation.isPending && deletingUserId === user._id}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
