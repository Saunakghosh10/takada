import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { invoices, payments } from "@/db/schema";

/**
 * GET /api/insights
 * Returns overall financial insights
 */
export async function GET() {
  try {
    const db = getDb();
    
    // Get all invoices with customer info
    const allInvoices = await db.query.invoices.findMany({
      with: {
        customer: true,
      },
    });

    // Get all payments
    const allPayments = await db.query.payments.findMany();

    // Calculate totals
    const totalInvoiced = allInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount.toString()), 0);
    const totalPaid = allPayments.reduce((sum, pay) => sum + parseFloat(pay.amount.toString()), 0);
    const totalOutstanding = totalInvoiced - totalPaid;

    // Calculate overdue amounts
    const today = new Date();
    const overdueInvoices = allInvoices.filter(inv => {
      const dueDate = new Date(inv.dueDate);
      const paidAmount = inv.paidAmount ? parseFloat(inv.paidAmount.toString()) : 0;
      const totalAmount = parseFloat(inv.amount.toString());
      return dueDate < today && paidAmount < totalAmount;
    });

    const totalOverdue = overdueInvoices.reduce((sum, inv) => {
      const outstanding = parseFloat(inv.amount.toString()) - (inv.paidAmount ? parseFloat(inv.paidAmount.toString()) : 0);
      return sum + outstanding;
    }, 0);

    // Calculate by aging buckets
    const agingBuckets = {
      current: 0,
      "0-30 days": 0,
      "31-60 days": 0,
      "61-90 days": 0,
      "90+ days": 0,
    };

    overdueInvoices.forEach(inv => {
      const dueDate = new Date(inv.dueDate);
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      const outstanding = parseFloat(inv.amount.toString()) - (inv.paidAmount ? parseFloat(inv.paidAmount.toString()) : 0);

      if (daysOverdue <= 0) {
        agingBuckets.current += outstanding;
      } else if (daysOverdue <= 30) {
        agingBuckets["0-30 days"] += outstanding;
      } else if (daysOverdue <= 60) {
        agingBuckets["31-60 days"] += outstanding;
      } else if (daysOverdue <= 90) {
        agingBuckets["61-90 days"] += outstanding;
      } else {
        agingBuckets["90+ days"] += outstanding;
      }
    });

    // Customer count and invoice stats
    const uniqueCustomers = new Set(allInvoices.map(inv => inv.customerId)).size;
    const pendingInvoices = allInvoices.filter(inv => inv.status === "pending").length;
    const paidInvoices = allInvoices.filter(inv => inv.status === "paid").length;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalInvoiced,
          totalPaid,
          totalOutstanding,
          totalOverdue,
        },
        agingBuckets,
        stats: {
          totalCustomers: uniqueCustomers,
          totalInvoices: allInvoices.length,
          pendingInvoices,
          paidInvoices,
          overdueInvoices: overdueInvoices.length,
        },
      },
    });

  } catch (error: any) {
    console.error("Failed to fetch insights:", error);
    const isDbSetupMissing = error.message?.includes("INVALID DATABASE URL");
    
    return NextResponse.json(
      { 
        success: false, 
        error: isDbSetupMissing ? "Database setup required" : "Failed to fetch insights",
        code: isDbSetupMissing ? "DB_CONNECTION_REQUIRED" : undefined
      },
      { status: isDbSetupMissing ? 400 : 500 }
    );
  }
}
