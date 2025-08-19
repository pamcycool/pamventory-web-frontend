"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Bell,
  CheckCircle,
  Globe,
  MessageSquare,
  Monitor,
  Shield,
  Smartphone,
  TrendingUp,
  Users,
  Package,
  FileText,
  Zap,
  ArrowRight,
  Star,
  Sparkles,
  Cpu,
  Database,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {useTranslations} from 'next-intl';
import { LanguageSwitcher } from "@/components/ui/language-switcher"


export default function Home() {
  const t = useTranslations('Home');
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-900/20 via-green-800/10 to-green-700/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(27,115,57,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(22,163,74,0.1),transparent_50%)]"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-green-500/20 rounded-full animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 border border-green-400/20 rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur-md opacity-50 animate-pulse"></div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              Pamventory
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:glow"
            >
              {t('Features')}
            </Link>
            <Link href="#platforms" className="text-gray-300 hover:text-green-400 transition-all duration-300">
              {t('Platforms')}
            </Link>
            <Link href="#pricing" className="text-gray-300 hover:text-green-400 transition-all duration-300">
              {t('Pricing')}
            </Link>
            <LanguageSwitcher />
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 border-0 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300">
                {t('Get Started')}
              </Button>
            </Link>

          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto text-center max-w-7xl relative z-10">
          <Badge className="mb-8 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 border border-green-500/30 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300">
            <Sparkles className="w-4 h-4 mr-2" />🚀 {t('Next-Gen Inventory for Nigerian Businesses')}
          </Badge>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent animate-pulse">
              {t('Inventory')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">{t('Reimagined')}</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-lg px-12 py-8 rounded-2xl shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-500 transform hover:scale-105 border-0"
            >
              <Zap className="mr-3 w-6 h-6" />
              {t('Launch Your Future')}
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-12 py-8 rounded-2xl bg-white/5 border border-white/20 text-white hover:bg-white/10 backdrop-blur-sm hover:shadow-lg hover:shadow-white/10 transition-all duration-300"
            >
              <Cpu className="mr-3 w-6 h-6" />
              {t('Experience Demo')}
            </Button>
          </div>

          {/* Futuristic Hero Visual */}
          <div className="relative max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-3xl p-5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 rounded-3xl blur-xl"></div>
              <div className="relative">
                <Image
                  src="/DASHBOARD.svg"
                  alt="Futuristic Pamventory Dashboard"
                  width={1100}
                  height={500}
                  className="rounded-2xl shadow-2xl mx-auto"
                />
                {/* Floating UI Elements */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-3 shadow-lg shadow-green-500/25 animate-bounce">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-green-700 rounded-xl p-3 shadow-lg shadow-green-500/25 animate-pulse">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                {t('Quantum-Powered')}
              </span>
              <br />
              <span className="text-white">{t('Business Tools')}</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              {t('featuresDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: t('Neural Inventory'),
                description: t('neuralInventoryDesc'),
                gradient: "from-green-500 to-green-600",
                glowColor: "green-500/25",
              },
              {
                icon: BarChart3,
                title: t('Holographic Analytics'),
                description: t('holographicAnalyticsDesc'),
                gradient: "from-green-600 to-green-700",
                glowColor: "green-600/25",
              },
              {
                icon: Globe,
                title: t('Universal Translation'),
                description: t('universalTranslationDesc'),
                gradient: "from-green-400 to-green-600",
                glowColor: "green-400/25",
              },
              {
                icon: Shield,
                title: t('Quantum Security'),
                description: t('quantumSecurityDesc'),
                gradient: "from-green-700 to-green-800",
                glowColor: "green-700/25",
              },
              {
                icon: Bell,
                title: t('Predictive Alerts'),
                description: t('predictiveAlertsDesc'),
                gradient: "from-green-500 to-green-700",
                glowColor: "green-500/25",
              },
              {
                icon: FileText,
                title: t('Quantum Reports'),
                description: t('quantumReportsDesc'),
                gradient: "from-green-600 to-green-800",
                glowColor: "green-600/25",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl rounded-2xl overflow-hidden"
              >
                <CardHeader className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${feature.glowColor} group-hover:shadow-xl transition-all duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="relative py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              <span className="text-white">{t('Tri-Platform')}</span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                {t('Ecosystem')}
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              {t('platformsDescription')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Web Dashboard */}
            <Card className="group bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 backdrop-blur-xl hover:from-green-500/20 hover:to-green-600/20 transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden shadow-2xl hover:shadow-green-500/25">
              <CardHeader className="text-center pb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 rounded-3xl blur-xl"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/25 group-hover:shadow-green-500/40 transition-all duration-300">
                  <Monitor className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                  Quantum Web
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Neural command center with holographic interface and real-time quantum processing
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">

                <ul className="space-y-4">
                  {[
                      t('Quantum-encrypted admin portal'),
                    t('Holographic inventory visualization'),
                    t('AI-powered user management'),
                    t('Instant quantum reports'),
                  ].map((item, index) => (
                    <li key={index} className="flex items-center group/item">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-4 group-hover/item:text-green-300 transition-colors duration-200" />
                      <span className="text-gray-300 group-hover/item:text-white transition-colors duration-200">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Mobile App */}
            <Card className="group bg-gradient-to-br from-green-600/10 to-green-700/10 border border-green-600/20 backdrop-blur-xl hover:from-green-600/20 hover:to-green-700/20 transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden shadow-2xl hover:shadow-green-600/25">
              <CardHeader className="text-center pb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-green-700/5 rounded-3xl blur-xl"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-green-500 to-green-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-600/25 group-hover:shadow-green-600/40 transition-all duration-300">
                  <Smartphone className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                  {t('Neural Mobile')}
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  {t('neuralMobileDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">

                <ul className="space-y-4">
                  {[
                    t('AR-enhanced inventory scanning'),
                    t('Quantum-speed notifications'),
                    t('Biometric authentication'),
                    t('Real-time neural sync'),
                  ].map((item, index) => (
                    <li key={index} className="flex items-center group/item">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-4 group-hover/item:text-green-300 transition-colors duration-200" />
                      <span className="text-gray-300 group-hover/item:text-white transition-colors duration-200">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* WhatsApp Bot */}
            <Card className="group bg-gradient-to-br from-green-400/10 to-green-600/10 border border-green-400/20 backdrop-blur-xl hover:from-green-400/20 hover:to-green-600/20 transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden shadow-2xl hover:shadow-green-400/25">
              <CardHeader className="text-center pb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-green-600/5 rounded-3xl blur-xl"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-400/25 group-hover:shadow-green-400/40 transition-all duration-300">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                  {t('AI PamBot')}
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  {t('aiPamBotDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">

                <ul className="space-y-4">
                  {[
                    t('Quantum AI conversation engine'),
                    t('Predictive inventory management'),
                    t('Neural pattern recognition'),
                    t('Automated business insights'),
                  ].map((item, index) => (
                    <li key={index} className="flex items-center group/item">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-4 group-hover/item:text-green-300 transition-colors duration-200" />
                      <span className="text-gray-300 group-hover/item:text-white transition-colors duration-200">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-black mb-8">
                <span className="text-white">{t('Engineered for')}</span>
                <br />
                <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                  {t('Nigerian Innovation')}
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                {t('benefitsDescription')}
              </p>
              <div className="space-y-8">
                {[
                  {
                    icon: Zap,
                    title: t('Quantum Deployment'),
                    description: t('quantumDeploymentDesc'),
                    gradient: "from-green-400 to-green-600",
                  },
                  {
                    icon: Users,
                      title: t('Cultural Intelligence'),
                    description: t('culturalIntelligenceDesc'),
                    gradient: "from-green-500 to-green-700",
                  },
                  {
                    icon: TrendingUp,
                    title: t('Predictive Growth'),
                    description: t('predictiveGrowthDesc'),
                    gradient: "from-green-600 to-green-800",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start group">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center mr-6 mt-2 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-300 text-lg leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-3xl p-8 backdrop-blur-xl border border-white/10 shadow-2xl">
                <Image
                  src="/CREDIT BOOK.svg"
                  alt="Future Nigerian Business"
                  width={600}
                  height={500}
                  className="rounded-2xl mx-auto shadow-lg"
                />
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-4 shadow-2xl shadow-green-500/25 animate-float">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div
                  className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-500 to-green-700 rounded-2xl p-4 shadow-2xl shadow-green-600/25 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                {t('Quantum Testimonials')}
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: t('Adaora Okafor'),
                role: t('Fashion Retailer, Lagos'),
                content:
                  t('testimonial1'),
                gradient: "from-green-500/10 to-green-600/10",
                borderGradient: "from-green-500/30 to-green-600/30",
              },
              {
                name: t('Musa Ibrahim'),
                role: t('Electronics Store, Kano'),
                content:
                  t('testimonial2'),
                gradient: "from-green-600/10 to-green-700/10",
                borderGradient: "from-green-600/30 to-green-700/30",
              },
              {
                name: t('Olumide Adebayo'),
                role: t('Pharmacy, Ibadan'),
                content:
                  t('testimonial3'),
                gradient: "from-green-400/10 to-green-600/10",
                borderGradient: "from-green-400/30 to-green-600/30",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className={`bg-gradient-to-br ${testimonial.gradient} border border-green-500/20 backdrop-blur-xl hover:scale-105 transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl`}
              >
                <CardContent className="p-8">
                  <div className="flex mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed">&quot;{testimonial.content}&quot;</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{testimonial.name}</p>
                      <p className="text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-3xl p-16 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 rounded-3xl blur-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
                {t('Ready to Enter the')}
                <br />
                <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                  {t('Business Future?')}
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                {t('ctaDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-xl px-16 py-10 rounded-2xl shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-500 transform hover:scale-105 border-0"
                >
                  <Zap className="mr-4 w-7 h-7" />
                  {t('Activate Quantum Mode')}
                  <ArrowRight className="ml-4 w-7 h-7" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 text-xl px-16 py-10 rounded-2xl bg-transparent backdrop-blur-sm hover:shadow-lg hover:shadow-white/10 transition-all duration-300"
                >
                  <Cpu className="mr-4 w-7 h-7" />
                  {t('Neural Demo')}
                </Button>
              </div>
              <p className="text-green-300 mt-8 text-lg">
                ⚡ {t('Quantum-encrypted')} • 🚀 {t('14-day neural trial')} • 🔮 {t('Cancel anytime')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black/50 backdrop-blur-xl border-t border-white/10 py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur-md opacity-50 animate-pulse"></div>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                  Pamventory
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {t('footerDescription')}
              </p>
            </div>
            {[
              {
                title: t('Quantum Features'),
                links: [t('Neural Analytics'), t('AI Predictions'), t('Quantum Sync'), t('Holographic UI')],
              },
              {
                title: t('Neural Support'),
                links: [t('AI Help Center'), t('Quantum Docs'), t('Neural Training'), t('24/7 Bot Support')],
              },
              {
                title: t('Future Company'),
                links: [t('About Quantum'), t('Tech Blog'), t('Neural Careers'), t('Privacy Shield')],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-bold text-white mb-6 text-lg">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-green-400 transition-colors duration-300 hover:glow"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 mt-16 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 Pamventory Quantum Systems. {t('All rights reserved')}
              <span className="text-green-400"> {t('Engineered with ⚡ for Nigerian Innovation')}</span>
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .glow {
          text-shadow: 0 0 10px currentColor;
        }
      `}</style>
    </div>
  )
}
