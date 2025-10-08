"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  CheckCircle,
  Globe,
  MessageSquare,
  Monitor,
  Shield,
  Smartphone,
  Package,
  FileText,
  ArrowRight,
  Store,
  Users,
  CreditCard,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/ui/language-switcher"


export default function Home() {
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
      <header className="z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0">
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
              className="text-gray-300 hover:text-green-400 transition-all duration-300"
            >
              Features
            </Link>
            <Link href="#platforms" className="text-gray-300 hover:text-green-400 transition-all duration-300">
              Platforms
            </Link>
            <LanguageSwitcher />
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 border-0 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto text-center max-w-7xl relative z-10">
          <Badge className="mb-8 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 border border-green-500/30 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300">
            🚀 Modern Inventory Management for Nigerian Businesses
          </Badge>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              Inventory
            </span>
            <br />
            <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">Management</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Manage your inventory, track sales, handle customer credit, and grow your business with our comprehensive platform designed for Nigerian retailers.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-lg px-12 py-8 rounded-2xl shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-500 transform hover:scale-105 border-0"
              >
                Start Free Trial
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-12 py-8 rounded-2xl bg-white/5 border border-white/20 text-white hover:bg-white/10 backdrop-blur-sm hover:shadow-lg hover:shadow-white/10 transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-3xl p-5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 rounded-3xl blur-xl"></div>
              <div className="relative">
                <Image
                  src="/DASHBOARD.svg"
                  alt="Pamventory Dashboard"
                  width={1100}
                  height={500}
                  className="rounded-2xl shadow-2xl mx-auto"
                />
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
                Powerful Features
              </span>
              <br />
              <span className="text-white">For Your Business</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Everything you need to manage your business efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: "Inventory Management",
                description: "Track your products, stock levels, and get low stock alerts to never run out",
                gradient: "from-green-500 to-green-600",
              },
              {
                icon: BarChart3,
                title: "Sales Tracking",
                description: "Record and monitor all your sales transactions with detailed reports",
                gradient: "from-green-600 to-green-700",
              },
              {
                icon: Store,
                title: "Multi-Store Management",
                description: "Manage multiple store locations from a single dashboard",
                gradient: "from-green-400 to-green-600",
              },
              {
                icon: CreditCard,
                title: "Credit Book",
                description: "Keep track of customer credit and outstanding payments easily",
                gradient: "from-green-700 to-green-800",
              },
              {
                icon: FileText,
                title: "Business Reports",
                description: "Generate detailed reports to understand your business performance",
                gradient: "from-green-500 to-green-700",
              },
              {
                icon: Globe,
                title: "Multi-Language Support",
                description: "Available in English and Yoruba for better accessibility",
                gradient: "from-green-600 to-green-800",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl rounded-2xl overflow-hidden"
              >
                <CardHeader className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
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
              <span className="text-white">Available On</span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                Multiple Platforms
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Access your business from anywhere with our web, mobile, and WhatsApp platforms
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Web Dashboard */}
            <Card className="group bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 backdrop-blur-xl hover:from-green-500/20 hover:to-green-600/20 transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden shadow-2xl">
              <CardHeader className="text-center pb-6 relative">
                <div className="relative w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/25 group-hover:shadow-green-500/40 transition-all duration-300">
                  <Monitor className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                  Web Dashboard
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Full-featured admin portal with comprehensive business management tools
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-4">
                  {[
                    "Complete inventory management",
                    "Sales and transaction tracking",
                    "Multi-store administration",
                    "Detailed business reports",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center group/item">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0" />
                      <span className="text-gray-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Mobile App */}
            <Card className="group bg-gradient-to-br from-green-600/10 to-green-700/10 border border-green-600/20 backdrop-blur-xl hover:from-green-600/20 hover:to-green-700/20 transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden shadow-2xl">
              <CardHeader className="text-center pb-6 relative">
                <div className="relative w-20 h-20 bg-gradient-to-r from-green-500 to-green-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-600/25 group-hover:shadow-green-600/40 transition-all duration-300">
                  <Smartphone className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                  Mobile App
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Manage your business on the go with our mobile application
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-4">
                  {[
                    "Quick inventory updates",
                    "Record sales anywhere",
                    "Real-time notifications",
                    "Offline mode support",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center group/item">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0" />
                      <span className="text-gray-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* WhatsApp Bot */}
            <Card className="group bg-gradient-to-br from-green-400/10 to-green-600/10 border border-green-400/20 backdrop-blur-xl hover:from-green-400/20 hover:to-green-600/20 transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden shadow-2xl">
              <CardHeader className="text-center pb-6 relative">
                <div className="relative w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-400/25 group-hover:shadow-green-400/40 transition-all duration-300">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                  WhatsApp Bot
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Manage your inventory through WhatsApp for easy access
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-4">
                  {[
                    "Check inventory via WhatsApp",
                    "Record sales through chat",
                    "Get instant notifications",
                    "No app installation needed",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center group/item">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0" />
                      <span className="text-gray-300">
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
                <span className="text-white">Built For</span>
                <br />
                <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                  Nigerian Businesses
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                We understand the unique needs of Nigerian retailers and have built our platform to address them.
              </p>
              <div className="space-y-8">
                {[
                  {
                    icon: Users,
                    title: "Easy to Use",
                    description: "Intuitive interface designed for business owners with minimal technical knowledge",
                    gradient: "from-green-400 to-green-600",
                  },
                  {
                    icon: Shield,
                    title: "Secure & Reliable",
                    description: "Your business data is protected with enterprise-grade security",
                    gradient: "from-green-500 to-green-700",
                  },
                  {
                    icon: TrendingUp,
                    title: "Grow Your Business",
                    description: "Make informed decisions with real-time insights and detailed analytics",
                    gradient: "from-green-600 to-green-800",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start group">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center mr-6 mt-2 shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0`}
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
                  alt="Credit Book Feature"
                  width={600}
                  height={500}
                  className="rounded-2xl mx-auto shadow-lg"
                />
              </div>
            </div>
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
                Ready To Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join hundreds of Nigerian businesses already using Pamventory to streamline their operations and grow their revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-xl px-16 py-10 rounded-2xl shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-500 transform hover:scale-105 border-0"
                  >
                    Create Free Account
                    <ArrowRight className="ml-4 w-7 h-7" />
                  </Button>
                </Link>
              </div>
              <p className="text-green-300 mt-8 text-lg">
                ✅ Free 14-day trial • 💳 No credit card required • 🔒 Secure & private
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
                Modern inventory management for Nigerian retailers.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Mobile App", "WhatsApp Bot"],
              },
              {
                title: "Company",
                links: ["About Us", "Contact", "Blog", "Careers"],
              },
              {
                title: "Support",
                links: ["Help Center", "Documentation", "Community", "Status"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-bold text-white mb-6 text-lg">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-green-400 transition-colors duration-300"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400">
                &copy; 2024 Pamventory. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link href="/privacy-policy" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                  Terms of Service
                </Link>
              </div>
            </div>
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
      `}</style>
    </div>
  )
}
