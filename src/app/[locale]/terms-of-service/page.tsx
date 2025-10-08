"use client"

import { Package } from "lucide-react"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from "@/components/ui/language-switcher"

export default function TermsOfService() {
  const t = useTranslations('TermsOfService');

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
            {t('Terms of Service')}
          </h1>
          <p className="text-gray-400 mb-8">
            {t('Last Updated')}: {t('October 8, 2025')}
          </p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('1. Acceptance of Terms')}</h2>
              <p className="leading-relaxed">
                {t('By accessing or using Pamventory\'s inventory management platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all users, including visitors, registered users, and paying subscribers.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('2. Description of Services')}</h2>
              <p className="leading-relaxed">
                {t('Pamventory provides a cloud-based inventory management platform designed for Nigerian SME retailers. Our services include inventory tracking, sales management, multi-store management, WhatsApp integration, AI-powered insights, and related features. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('3. User Accounts')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">{t('3.1 Account Creation')}</h3>
                  <p className="leading-relaxed">
                    {t('To use certain features of our services, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate and complete.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">{t('3.2 Account Security')}</h3>
                  <p className="leading-relaxed">
                    {t('You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">{t('3.3 Account Eligibility')}</h3>
                  <p className="leading-relaxed">
                    {t('You must be at least 18 years old and legally capable of entering into binding contracts to use our services. By using Pamventory, you represent and warrant that you meet these requirements.')}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('4. Subscription and Payments')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">{t('4.1 Subscription Plans')}</h3>
                  <p className="leading-relaxed">
                    {t('Pamventory offers various subscription plans with different features and pricing. By subscribing to a paid plan, you agree to pay the applicable fees for the selected plan.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">{t('4.2 Billing')}</h3>
                  <p className="leading-relaxed">
                    {t('Subscription fees are billed in advance on a recurring basis (monthly or annually, as selected). You authorize us to charge your payment method for all fees incurred. All fees are non-refundable except as required by law or as expressly stated in these terms.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">{t('4.3 Cancellation')}</h3>
                  <p className="leading-relaxed">
                    {t('You may cancel your subscription at any time. Cancellations will be effective at the end of the current billing period. You will retain access to paid features until the end of your billing period.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">{t('4.4 Price Changes')}</h3>
                  <p className="leading-relaxed">
                    {t('We reserve the right to change our pricing at any time. If we change our pricing, we will provide you with reasonable notice, and the change will apply to your next billing cycle.')}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('5. User Content and Data')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">{t('5.1 Your Data')}</h3>
                  <p className="leading-relaxed">
                    {t('You retain all rights to the data you input into our services. By using our services, you grant us a limited license to use, store, and process your data solely for the purpose of providing our services to you.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">{t('5.2 Data Responsibility')}</h3>
                  <p className="leading-relaxed">
                    {t('You are responsible for the accuracy, quality, and legality of your data and the means by which you acquired it. You must ensure you have all necessary rights to use and share your data through our services.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">{t('5.3 Backup')}</h3>
                  <p className="leading-relaxed">
                    {t('While we regularly back up data, we recommend that you maintain your own backup copies of your data. We are not responsible for any loss or corruption of your data.')}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('6. Prohibited Uses')}</h2>
              <p className="leading-relaxed mb-3">
                {t('You agree not to use our services to:')}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t('Violate any applicable laws or regulations')}</li>
                <li>{t('Infringe on the rights of others')}</li>
                <li>{t('Transmit viruses, malware, or other harmful code')}</li>
                <li>{t('Attempt to gain unauthorized access to our systems')}</li>
                <li>{t('Interfere with or disrupt our services')}</li>
                <li>{t('Use automated systems to access our services without permission')}</li>
                <li>{t('Resell or redistribute our services without authorization')}</li>
                <li>{t('Engage in fraudulent activities')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('7. Intellectual Property')}</h2>
              <p className="leading-relaxed">
                {t('The Pamventory platform, including its design, features, functionality, and all content (excluding user content), is owned by Pamventory and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our services without our express written permission.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('8. Third-Party Services')}</h2>
              <p className="leading-relaxed">
                {t('Our services may integrate with third-party services (such as WhatsApp, payment providers, etc.). Your use of third-party services is subject to their respective terms and conditions. We are not responsible for any third-party services or their availability.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('9. Disclaimers and Warranties')}</h2>
              <p className="leading-relaxed">
                {t('OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE. YOU USE OUR SERVICES AT YOUR OWN RISK.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('10. Limitation of Liability')}</h2>
              <p className="leading-relaxed">
                {t('TO THE MAXIMUM EXTENT PERMITTED BY LAW, PAMVENTORY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, OR GOODWILL ARISING FROM YOUR USE OF OUR SERVICES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('11. Indemnification')}</h2>
              <p className="leading-relaxed">
                {t('You agree to indemnify, defend, and hold harmless Pamventory and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of our services, your violation of these terms, or your violation of any rights of another party.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('12. Termination')}</h2>
              <p className="leading-relaxed">
                {t('We reserve the right to suspend or terminate your account and access to our services at any time, with or without cause, and with or without notice. Upon termination, your right to use our services will immediately cease. Provisions of these terms that by their nature should survive termination will survive.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('13. Governing Law')}</h2>
              <p className="leading-relaxed">
                {t('These Terms of Service shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Nigeria.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('14. Changes to Terms')}</h2>
              <p className="leading-relaxed">
                {t('We may modify these Terms of Service at any time. If we make material changes, we will notify you by email or through our services. Your continued use of our services after such changes constitutes your acceptance of the updated terms.')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-green-400 mb-4">{t('15. Contact Information')}</h2>
              <p className="leading-relaxed">
                {t('If you have any questions about these Terms of Service, please contact us at:')}
              </p>
              <div className="mt-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="font-semibold">Pamventory</p>
                <p>Email: support@pamventory.com</p>
                <p>Legal: legal@pamventory.com</p>
                <p>Address: Lagos, Nigeria</p>
              </div>
            </section>

            <section className="mt-8 p-6 bg-green-500/5 border border-green-500/20 rounded-xl">
              <p className="text-sm leading-relaxed">
                {t('By using Pamventory, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.')}
              </p>
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

