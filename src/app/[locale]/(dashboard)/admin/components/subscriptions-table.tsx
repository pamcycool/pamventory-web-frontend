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

interface Subscription {
  _id: string
  user: {
    name: string
    email: string
  }
  plan: string
  status: string
  amount: number
  startDate: string
  endDate: string
  createdAt: string
}

interface SubscriptionsTableProps {
  subscriptions: Subscription[]
}

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status || 'Unknown'}</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No subscriptions found
              </TableCell>
            </TableRow>
          ) : (
            subscriptions.map((subscription) => (
              <TableRow key={subscription._id}>
                <TableCell className="font-medium">
                  {subscription.user?.name || 'N/A'}
                </TableCell>
                <TableCell>{subscription.user?.email || 'N/A'}</TableCell>
                <TableCell className="capitalize">{subscription.plan || 'N/A'}</TableCell>
                <TableCell>₦{subscription.amount?.toLocaleString() || 0}</TableCell>
                <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                <TableCell>
                  {subscription.startDate
                    ? format(new Date(subscription.startDate), 'MMM dd, yyyy')
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {subscription.endDate
                    ? format(new Date(subscription.endDate), 'MMM dd, yyyy')
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {format(new Date(subscription.createdAt), 'MMM dd, yyyy')}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
