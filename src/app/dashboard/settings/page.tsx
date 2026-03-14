"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Database, 
  Globe,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();

  const sections = [
    {
      title: "Profile Information",
      description: "Manage your personal details and account preferences",
      icon: User,
      items: [
        { label: "Full Name", value: user?.fullName, icon: User },
        { label: "Email Address", value: user?.primaryEmailAddress?.emailAddress, icon: Mail },
      ]
    },
    {
      title: "Integrations & API",
      description: "Configure connection to your external accounting systems",
      icon: Database,
      items: [
        { label: "External API Status", value: "Connected", icon: Globe, status: "success" },
        { label: "Neon Database", value: "Active", icon: Database, status: "success" },
      ]
    },
    {
      title: "Security & Privacy",
      description: "Authentication settings and security logs",
      icon: Shield,
      items: [
        { label: "Standard Authentication", value: "Clerk Auth Protected", icon: Shield },
        { label: "Two-Factor Auth", value: "Managed by Clerk", icon: Bell },
      ]
    }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Application Settings</h1>
            <p className="text-xs text-slate-500 font-medium">Manage your profile and system preferences</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 w-full space-y-8">
        <div className="flex flex-col gap-6">
          {sections.map((section, idx) => (
            <Card key={idx} className="border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                      <section.icon size={20} />
                   </div>
                   <div>
                     <CardTitle className="text-lg font-bold">{section.title}</CardTitle>
                     <CardDescription>{section.description}</CardDescription>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                        <item.icon size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                        <p className="font-semibold text-slate-700">{item.value}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-primary-500 transition-colors" size={20} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <Card className="border-none shadow-sm bg-slate-900 text-white">
            <CardContent className="p-8 space-y-4">
              <h3 className="text-xl font-bold">Manage Account Externally</h3>
              <p className="text-slate-400 text-sm">To change your password or security settings, please visit the Clerk Account Management portal.</p>
              <Button variant="outline" className="w-full mt-4 border-slate-700 text-white hover:bg-slate-800 transition-all rounded-xl">
                 Account Portal
                 <ExternalLink size={16} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
