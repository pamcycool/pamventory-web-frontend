"use client"

import { Home, BarChart3, Package, ShoppingCart, FileText, CreditCard, Settings, LogOut, Store } from "lucide-react"
import { usePathname, Link } from "@/i18n/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useTranslations } from "next-intl"

export function AppSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const t = useTranslations('Dashboard')

  const menuItems = [
    { title: t('Home'), url: "/home", icon: Home },
    { title: t('Dashboard'), url: "/dashboard", icon: BarChart3 },
    { title: t('Inventory'), url: "/inventory", icon: Package },
    { title: t('Sales'), url: "/sales", icon: ShoppingCart },
    { title: t('Report'), url: "/report", icon: FileText },
    { title: t('Credit book'), url: "/credit-book", icon: CreditCard },
  ]

  const bottomMenuItems = [
    { title: t('Settings'), url: "/settings", icon: Settings },
  ]

  return (
    <Sidebar className="w-64 bg-[#fcfcfc] border-none">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 bg-[#1B7339] text-white px-4 py-3 rounded-lg">
          <div className="w-8 h-8 border border-white rounded-full flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">Pamventory</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 mt-5">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title} className="cursor-pointer">
              <SidebarMenuButton asChild className="cursor-pointer">
                <Link
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-6 rounded-lg cursor-pointer",
                    pathname === item.url
                      ? "bg-[#1B7339]/10 text-[#1B7339]"
                      : "text-black hover:bg-gray-200"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className="flex items-center gap-3 px-3 py-6 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          
          {/* Logout Button */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={signOut}
                className="flex items-center gap-3 px-3 py-6 rounded-lg text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('Log out')}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
