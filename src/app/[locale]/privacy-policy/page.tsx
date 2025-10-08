"use client"

import { Package } from "lucide-react"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from "@/components/ui/language-switcher"

export default function PrivacyPolicy() {
  const t = useTranslations('PrivacyPolicy');

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-900/20 via-green-800/10 to-green-700/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(27,115,57,0.1),transparent_50%)]"></div>
      </div>

      {/* Header */}
      <header className="z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur-md opacity-50 animate-pulse"></div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              Pamventory
            </span>
          </Link>
          <nav className="flex items-center space-x-4">
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
            {t('Privacy Policy')}
          </h1>
          <p className="text-gray-400 mb-8">
            {t('Last Updated')}: {t('October 8, 2025')}
          </p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('1. Introduction')}</h2>
              <p className="leading-relaxed">
                {t('Welcome to Pamventory. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our inventory management platform.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('2. Information We Collect')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">{t('2.1 Personal Information')}</h3>
                  <p className="leading-relaxed">
                    {t('We collect information that you provide directly to us, including:')}
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>{t('Name, email address, and phone number')}</li>
                    <li>{t('Business name and address')}</li>
                    <li>{t('Payment and billing information')}</li>
                    <li>{t('Account credentials')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">{t('2.2 Business Data')}</h3>
                  <p className="leading-relaxed">
                    {t('We collect and store data related to your business operations, including:')}
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>{t('Inventory information')}</li>
                    <li>{t('Sales and transaction records')}</li>
                    <li>{t('Customer data')}</li>
                    <li>{t('Store and product information')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">{t('2.3 Automatically Collected Information')}</h3>
                  <p className="leading-relaxed">
                    {t('When you use our services, we automatically collect:')}
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>{t('Device information and IP address')}</li>
                    <li>{t('Browser type and version')}</li>
                    <li>{t('Usage data and analytics')}</li>
                    <li>{t('Cookies and similar tracking technologies')}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('3. How We Use Your Information')}</h2>
              <p className="leading-relaxed mb-3">
                {t('We use the information we collect to:')}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t('Provide, maintain, and improve our services')}</li>
                <li>{t('Process your transactions and manage your account')}</li>
                <li>{t('Send you technical notices and support messages')}</li>
                <li>{t('Respond to your comments and questions')}</li>
                <li>{t('Generate analytics and insights for your business')}</li>
                <li>{t('Detect, prevent, and address security issues')}</li>
                <li>{t('Comply with legal obligations')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('4. Data Sharing and Disclosure')}</h2>
              <p className="leading-relaxed mb-3">
                {t('We do not sell your personal information. We may share your information in the following circumstances:')}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t('With your consent or at your direction')}</li>
                <li>{t('With service providers who perform services on our behalf')}</li>
                <li>{t('To comply with legal obligations')}</li>
                <li>{t('To protect the rights and safety of Pamventory and others')}</li>
                <li>{t('In connection with a business transaction (merger, acquisition, etc.)')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('5. Data Security')}</h2>
              <p className="leading-relaxed">
                {t('We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('6. Data Retention')}</h2>
              <p className="leading-relaxed">
                {t('We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('7. Your Rights')}</h2>
              <p className="leading-relaxed mb-3">
                {t('Depending on your location, you may have certain rights regarding your personal information, including:')}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t('Access to your personal information')}</li>
                <li>{t('Correction of inaccurate data')}</li>
                <li>{t('Deletion of your data')}</li>
                <li>{t('Objection to processing')}</li>
                <li>{t('Data portability')}</li>
                <li>{t('Withdrawal of consent')}</li>
              </ul>
              <p className="leading-relaxed mt-3">
                {t('To exercise these rights, please contact us at privacy@pamventory.com')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('8. International Data Transfers')}</h2>
              <p className="leading-relaxed">
                {t('Your information may be transferred to and processed in countries other than your country of residence. We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable laws.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('9. Children\'s Privacy')}</h2>
              <p className="leading-relaxed">
                {t('Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('10. Changes to This Privacy Policy')}</h2>
              <p className="leading-relaxed">
                {t('We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of our services after such changes constitutes your acceptance of the updated Privacy Policy.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('11. Contact Us')}</h2>
              <p className="leading-relaxed">
                {t('If you have any questions about this Privacy Policy or our privacy practices, please contact us at:')}
              </p>
              <div className="mt-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="font-semibold">Pamventory</p>
                <p>Email: privacy@pamventory.com</p>
                <p>Address: Lagos, Nigeria</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Pamventory. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-green-400 text-sm">
                {t('Privacy Policy')}
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-green-400 text-sm">
                {t('Terms of Service')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

