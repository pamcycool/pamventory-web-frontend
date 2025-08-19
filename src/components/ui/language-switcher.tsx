"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, ChevronDown } from "lucide-react"
import { useRouter, usePathname } from "@/i18n/navigation"
import { useLocale } from "next-intl"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
  ]

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span className="mr-1">{currentLanguage.flag}</span>
          {currentLanguage.name}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`text-gray-700 hover:text-[#1B7339] hover:bg-gray-50 transition-all duration-300 ${
              locale === language.code ? 'text-[#1B7339] bg-[#1B7339]/10' : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
