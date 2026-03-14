"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Download, Filter, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { exportToCSV } from "@/lib/csv-utils";

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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    exportToCSV(filteredCustomers, "customers-list");
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Manage Customers</h1>
            <p className="text-xs text-slate-500 font-medium">View and manage your receivable accounts</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleExport}>
              <Download size={16} className="mr-2" />
              Export List
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 w-full space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search customers by name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Filter size={18} className="mr-2" />
            Filters
          </Button>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="bg-white">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100">
                  <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest pl-6 py-4">Customer Details</TableHead>
                  <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest text-right">Credit Limit</TableHead>
                  <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest text-right">Outstanding</TableHead>
                  <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest text-right">Overdue</TableHead>
                  <TableHead className="font-bold text-slate-500 text-[10px] uppercase tracking-widest pr-6">Health Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary-600/50" />
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-slate-500">
                      No customers found matching your search.
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="font-bold text-slate-900">{customer.name}</div>
                      <div className="text-xs text-slate-400 font-medium">{customer.email}</div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-600">
                      {formatCurrency(customer.creditLimit)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatCurrency(customer.outstanding)}
                    </TableCell>
                    <TableCell className="text-right">
                      {customer.overdue > 0 ? (
                        <span className="text-rose-600 font-bold">{formatCurrency(customer.overdue)}</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">None</span>
                      )}
                    </TableCell>
                    <TableCell className="pr-6">
                      {customer.overdue > 0 ? (
                        <Badge className="bg-rose-50 text-rose-600 border-none font-bold text-[10px] rounded-full px-3">CRITICAL</Badge>
                      ) : customer.outstanding > 10000 ? (
                        <Badge className="bg-amber-50 text-amber-600 border-none font-bold text-[10px] rounded-full px-3">AT RISK</Badge>
                      ) : (
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] rounded-full px-3">SAFE</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}
