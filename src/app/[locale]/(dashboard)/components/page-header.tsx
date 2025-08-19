import { LanguageSwitcher } from "@/components/ui/language-switcher"

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
        <LanguageSwitcher />
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
