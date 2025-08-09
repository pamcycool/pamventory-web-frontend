import { ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface PageHeaderProps {
  title: string
  subtitle?: string
  bannerTitle: string
  bannerSubtitle: string
}

export function PageHeader({ title, subtitle, bannerTitle, bannerSubtitle }: PageHeaderProps) {
  return (
    <div className="bg-white p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-medium text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              English
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Spanish</DropdownMenuItem>
            <DropdownMenuItem>French</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {
        bannerTitle && bannerSubtitle && (
          <div className="bg-[url(/BannerBg.svg)] bg-cover bg-center text-white p-6 relative overflow-hidden rounded-lg">
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold mb-2">{bannerTitle}</h2>
              <p className="text-green-100">{bannerSubtitle}</p>
            </div>
          </div>
        )
      }

    </div>
  )
}
