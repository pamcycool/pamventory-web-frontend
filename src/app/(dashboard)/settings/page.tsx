import { PageHeader } from "@/app/(dashboard)/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Subscription from "./components/Subscription"
import Personal from "./components/Personal"
import Security from "./components/Security"

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <PageHeader title="Profile" bannerTitle="" bannerSubtitle="" />

      <div className="p-6 -mt-6">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" />
            <AvatarFallback>PC</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">Pamela Chidinma</h2>
            <p className="text-gray-600">08034567890</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Account settings</h3>
          <Tabs defaultValue="subscription" className="w-full">
            <TabsList className="grid w-2xl grid-cols-3 h-12">
              <TabsTrigger value="personal">Personal info</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="subscription" className="mt-6">
             <Subscription />
            </TabsContent>

            <TabsContent value="personal">
             <Personal />
            </TabsContent>

            <TabsContent value="security">
              <Security />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
