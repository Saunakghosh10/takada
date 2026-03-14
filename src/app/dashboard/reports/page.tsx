"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Download, 
  Calendar,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { exportToCSV } from "@/lib/csv-utils";

export default function ReportsPage() {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch("/api/insights");
        const data = await res.json();
        if (data.success) {
          setInsights(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch insights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const handleExport = () => {
    if (!insights) return;
    const reportData = [
      { Metric: "Total Invoiced", Value: insights.summary.totalInvoiced },
      { Metric: "Total Paid", Value: insights.summary.totalPaid },
      { Metric: "Total Outstanding", Value: insights.summary.totalOutstanding },
      { Metric: "Total Overdue", Value: insights.summary.totalOverdue },
      ...Object.entries(insights.agingBuckets).map(([k, v]) => ({ Metric: `Aging: ${k}`, Value: v }))
    ];
    exportToCSV(reportData, "financial-summary-report");
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Financial Reports</h1>
            <p className="text-xs text-slate-500 font-medium">Deep analytics and performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleExport}>
              <Download size={16} className="mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary-500/50" />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="text-primary-600" size={20} />
                  Revenue Trends
                </CardTitle>
                <CardDescription>Monthly comparison of invoiced vs collected</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-end justify-between gap-2 pt-10 px-8">
                {[45, 60, 48, 75, 90, 65, 85].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-slate-100 rounded-t-lg relative h-full flex flex-col justify-end overflow-hidden">
                       <div className="w-full bg-primary-500 transition-all group-hover:bg-primary-600" style={{ height: `${h}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">MAY {10+i}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="text-primary-600" size={20} />
                  Aging Distribution
                </CardTitle>
                <CardDescription>Breakdown of all outstanding receivables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(insights.agingBuckets).map(([bucket, amount]: [string, any], i) => (
                  <div key={bucket} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">{bucket}</span>
                      <span className="text-slate-900">{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full" 
                        style={{ width: `${(amount / insights.summary.totalOutstanding) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-none shadow-sm">
              <CardHeader>
                <CardTitle>Recent Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Collection speed improved by 12%</p>
                      <p className="text-xs text-slate-500">Compared to last quarter analysis</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-400" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">$24,500 expected in next 7 days</p>
                      <p className="text-xs text-slate-500">Based on promised payment dates</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
