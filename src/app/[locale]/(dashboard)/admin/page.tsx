"use client"

import { useQuery } from '@tanstack/react-query'
import { adminApiClient } from '@/lib/api/admin'
import { AdminGuard } from '@/components/auth/admin-guard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Store,
  CreditCard,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react'
import { UsersTable } from './components/users-table'
import { StoresTable } from './components/stores-table'
import { SubscriptionsTable } from './components/subscriptions-table'

export default function AdminPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApiClient.getDashboardStats,
  })

  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers, error: usersError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminApiClient.getAllUsers,
  })

  const { data: storesData, isLoading: storesLoading, error: storesError } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: adminApiClient.getAllStores,
  })

  const { data: subscriptionsData, isLoading: subscriptionsLoading, error: subscriptionsError } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: adminApiClient.getAllSubscriptions,
  })


  return (
    <AdminGuard>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, stores, and subscriptions</p>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.data?.users?.total || 0}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {stats?.data?.users?.verified || 0} verified
                </p>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Active Users
                </CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.data?.users?.active || 0}</div>
                <p className="text-xs text-gray-600 mt-1">
                  Last 30 days
                </p>
              </CardContent>
            </Card>

            {/* Total Stores */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Stores
                </CardTitle>
                <Store className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.data?.stores?.total || 0}</div>
                <p className="text-xs text-gray-600 mt-1">
                  Across all users
                </p>
              </CardContent>
            </Card>

            {/* Subscriptions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Subscriptions
                </CardTitle>
                <CreditCard className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.data?.users?.activeSubscription || 0}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {stats?.data?.users?.trial || 0} on trial
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscription Status Cards */}
        {!statsLoading && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.data?.users?.activeSubscription || 0}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Trial Users</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.data?.users?.trial || 0}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Expired</CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.data?.users?.expired || 0}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : usersError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-2">Error loading users</p>
                    <p className="text-sm text-gray-600">{(usersError as any)?.response?.data?.message || (usersError as Error).message}</p>
                  </div>
                ) : (
                  <UsersTable users={usersData?.data || []} refetch={refetchUsers} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Store Management</CardTitle>
                <CardDescription>
                  View all stores across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {storesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : storesError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-2">Error loading stores</p>
                    <p className="text-sm text-gray-600">{(storesError as any)?.response?.data?.message || (storesError as Error).message}</p>
                  </div>
                ) : (
                  <StoresTable stores={storesData?.data || []} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>
                  View all subscription records
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscriptionsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : subscriptionsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-2">Error loading subscriptions</p>
                    <p className="text-sm text-gray-600">{(subscriptionsError as any)?.response?.data?.message || (subscriptionsError as Error).message}</p>
                  </div>
                ) : (
                  <SubscriptionsTable subscriptions={subscriptionsData?.data || []} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  )
}
