"use client";

import { usePathname } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { 
  Users, 
  TrendingUp, 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  Layers 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Reports", href: "/dashboard/reports", icon: TrendingUp },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-white/50 backdrop-blur-md sticky top-0 h-screen">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
          <Layers size={18} />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900">Takaada</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                isActive 
                  ? "bg-primary-50 text-primary-700 font-semibold shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <item.icon size={20} className={isActive ? "text-primary-600" : "text-slate-500"} />
              {item.name}
            </a>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-4 py-3">
           <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 overflow-hidden">
              {user?.imageUrl ? <img src={user.imageUrl} alt="avatar" /> : user?.firstName?.[0]}
           </div>
           <div className="flex-1 overflow-hidden">
             <p className="text-sm font-bold text-slate-900 truncate">{user?.fullName}</p>
             <p className="text-xs text-slate-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
           </div>
        </div>
        <SignOutButton>
          <button className="flex items-center w-full gap-3 px-4 py-2 mt-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">
            <LogOut size={16} />
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
