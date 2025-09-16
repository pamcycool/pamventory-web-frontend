import type React from "react"
import { AppSidebar } from "@/app/[locale]/(dashboard)/components/app-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { StoreGuard } from "@/components/auth/store-guard"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SubscriptionProvider } from "@/contexts/subscription-context"
import { StoreProvider } from "@/contexts/store-context"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <SubscriptionProvider>
        <StoreProvider>
          <StoreGuard>
            <SidebarProvider defaultOpen={true}>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex-1 py-3 pr-3 bg-[#fcfcfc]">
                  <main className="flex-1 border border-[#d7d7d7] rounded-xl p-6">{children}</main>
                </div>
              </div>
            </SidebarProvider>
          </StoreGuard>
        </StoreProvider>
      </SubscriptionProvider>
    </ProtectedRoute>
  )
}