"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface Store {
  _id: string
  name: string
  description?: string
  address?: string
  phone?: string
  isActive: boolean
  userId: {
    name: string
    email: string
  }
  createdAt: string
}

interface StoresTableProps {
  stores: Store[]
}

export function StoresTable({ stores }: StoresTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No stores found
              </TableCell>
            </TableRow>
          ) : (
            stores.map((store) => (
              <TableRow key={store._id}>
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell>{store.userId?.name || 'N/A'}</TableCell>
                <TableCell>{store.userId?.email || 'N/A'}</TableCell>
                <TableCell>{store.phone || 'N/A'}</TableCell>
                <TableCell>
                  {store.isActive ? (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>{format(new Date(store.createdAt), 'MMM dd, yyyy')}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
