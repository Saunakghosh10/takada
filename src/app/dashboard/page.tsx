"use client";

import { useEffect, useState } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, AlertCircle, Users, RefreshCw, CheckCircle2, Clock, Layers, LayoutDashboard, Settings, HelpCircle, LogOut, BarChart3 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { exportToCSV } from "@/lib/csv-utils";
import DatabaseSetupRequired from "@/components/database-setup-required";

interface InsightsData {
  summary: {
    totalInvoiced: number;
    totalPaid: number;
    totalOutstanding: number;
    totalOverdue: number;
  };
  agingBuckets: {
    current: number;
    "0-30 days": number;
    "31-60 days": number;
    "61-90 days": number;
    "90+ days": number;
  };
  stats: {
    totalCustomers: number;
    totalInvoices: number;
    pendingInvoices: number;
    paidInvoices: number;
    overdueInvoices: number;
  };
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  creditLimit: number;
  outstanding: number;
  overdue: number;
  creditUtilization: number;
  invoiceCount: number;
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [dbSetupRequired, setDbSetupRequired] = useState(false);

  const fetchData = async () => {
    try {
      const [insightsRes, customersRes] = await Promise.all([
        fetch("/api/insights"),
        fetch("/api/customers"),
      ]);
      
      const insightsData = await insightsRes.json();
      const customersData = await customersRes.json();
      
      if (insightsData.code === "DB_CONNECTION_REQUIRED" || insightsRes.status === 400) {
        setDbSetupRequired(true);
        setLoading(false);
        return;
      }
      
      if (insightsData.success && customersData.success) {
        setInsights(insightsData.data);
        setCustomers(customersData.data);
        setDbSetupRequired(false);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetchData();
      }
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
          <p className="text-slate-500 font-medium">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  if (dbSetupRequired) {
    return (
      <div className="min-h-screen flex bg-slate-50">
        {/* Simplified Sidebar if DB is not setup */}
        <aside className="hidden lg:flex w-64 flex-col border-r bg-white/50 backdrop-blur-md sticky top-0 h-screen">
          <div className="p-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <Layers size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Takaada</span>
          </div>
          <div className="flex-1 px-4 mt-10">
             <div className="p-4 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold">
                Waiting for database connection...
             </div>
          </div>
        </aside>
        <div className="flex-1 flex flex-col justify-center">
          <DatabaseSetupRequired />
        </div>
      </div>
    );
  }

  const handleExportCSV = () => {
    exportToCSV(customers, "customer-risk-profile");
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Financial Insights</h1>
            <p className="text-xs text-slate-500 font-medium">Data refreshed just now</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleSync} disabled={syncing} variant="default" className="rounded-full shadow-lg shadow-primary-500/20">
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync Records"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-10 w-10 animate-spin text-primary-600/50" />
          </div>
        ) : insights ? (
          <>
            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Total Invoiced", value: insights.summary.totalInvoiced, icon: DollarSign, color: "text-slate-600", bg: "bg-slate-100" },
                { title: "Total Paid", value: insights.summary.totalPaid, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                { title: "Outstanding", value: insights.summary.totalOutstanding, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { title: "Overdue", value: insights.summary.totalOverdue, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
              ].map((card, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow transition-transform hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">{card.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                      <card.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${card.color}`}>{formatCurrency(card.value)}</div>
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <TrendingUp size={10} className="text-emerald-500" />
                      <span>+2.4% FROM LAST MONTH</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Aging Buckets */}
              <Card className="lg:col-span-2 border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                    <BarChart3 className="text-primary-600" size={20} />
                    Receivables Aging Analysis
                  </CardTitle>
                  <CardDescription className="text-slate-500">Breakdown of overdue amounts by duration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(insights.agingBuckets).map(([bucket, amount]) => (
                      <div key={bucket} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-center border border-slate-100 group hover:border-primary-200 transition-colors">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-primary-500 transition-colors">{bucket === "current" ? "On Time" : bucket}</p>
                        <p className={`text-lg font-bold ${amount > 0 ? "text-rose-600" : "text-slate-900"}`}>
                          {formatCurrency(amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Stats */}
              <Card className="border-none shadow-sm bg-primary-600 text-white overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp size={120} />
                 </div>
                 <CardHeader>
                  <CardTitle className="text-lg font-bold">Collection Efficiency</CardTitle>
                  <CardDescription className="text-primary-100 text-xs">Overall payment performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="relative flex items-center justify-center">
                     <div className="text-center">
                        <p className="text-5xl font-black">
                          {insights.summary.totalInvoiced > 0 
                            ? Math.round((insights.summary.totalPaid / insights.summary.totalInvoiced) * 100) 
                            : 0}%
                        </p>
                        <p className="text-[10px] font-bold text-primary-200 uppercase tracking-widest mt-1">Recovery Rate</p>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-primary-100">{insights.stats.paidInvoices} Paid</span>
                        <span>{insights.stats.totalInvoices} Total</span>
                     </div>
                     <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                          style={{ width: `${(insights.stats.paidInvoices / insights.stats.totalInvoices) * 100}%` }}
                        />
                     </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customers Table */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900">Customer Risk Profile</CardTitle>
                  <CardDescription className="text-slate-500">Monitoring credit limits and utilization</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-full" onClick={handleExportCSV}>
                  Export CSV
                </Button>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table className="bg-white">
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100">
                      <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest pl-6">Customer</TableHead>
                      <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest text-right">Outstanding</TableHead>
                      <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest text-right">Overdue</TableHead>
                      <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest text-right">Utilization</TableHead>
                      <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest pr-6">Health Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="pl-6 py-4">
                          <div className="font-bold text-slate-900">{customer.name}</div>
                          <div className="text-xs text-slate-400 font-medium">{customer.email}</div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-slate-800">
                          {formatCurrency(customer.outstanding)}
                        </TableCell>
                        <TableCell className="text-right">
                          {customer.overdue > 0 ? (
                            <span className="text-rose-600 font-bold">{formatCurrency(customer.overdue)}</span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-3">
                            <span className="text-[10px] font-black text-slate-500">{customer.creditUtilization}%</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${customer.creditUtilization > 90 ? "bg-rose-500" : customer.creditUtilization > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                                style={{ width: `${Math.min(customer.creditUtilization, 100)}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="pr-6">
                          {customer.overdue > 0 ? (
                            <Badge className="bg-rose-50 text-rose-600 border-none font-bold text-[10px] rounded-full px-3">CRITICAL</Badge>
                          ) : customer.outstanding > 0 ? (
                            <Badge className="bg-amber-50 text-amber-600 border-none font-bold text-[10px] rounded-full px-3">AT RISK</Badge>
                          ) : (
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] rounded-full px-3">EXCELLENT</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </>
        ) : (
          <div className="text-center py-20 glass-card rounded-3xl p-12 max-w-lg mx-auto border-white/50 space-y-6">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
              <LayoutDashboard size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Ready to start?</h2>
              <p className="text-slate-500">Connect your external accounts to see financial insights and manage your receivables effectively.</p>
            </div>
            <Button onClick={handleSync} className="rounded-full px-8 py-6 h-auto text-lg shadow-xl shadow-primary-500/20">
              <RefreshCw className="h-5 w-5 mr-2" />
              Initialize First Sync
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
