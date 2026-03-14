import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { customers, invoices, payments } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/customers
 * Returns all customers with their outstanding balances
 */
export async function GET() {
  try {
    const db = getDb();
    const allCustomers = await db.query.customers.findMany();
    const allInvoices = await db.query.invoices.findMany();
    const allPayments = await db.query.payments.findMany();

    const customersWithBalance = allCustomers.map(customer => {
      const customerInvoices = allInvoices.filter(inv => inv.customerId === customer.id);
      const customerInvoiceIds = customerInvoices.map(inv => inv.id);

      const customerPayments = allPayments.filter(pay =>
        customerInvoiceIds.includes(pay.invoiceId)
      );

      const totalInvoiced = customerInvoices.reduce((sum, inv) =>
        sum + parseFloat(inv.amount.toString()), 0
      );

      const totalPaid = customerPayments.reduce((sum, pay) =>
        sum + parseFloat(pay.amount.toString()), 0
      );

      const outstanding = totalInvoiced - totalPaid;

      // Calculate overdue amount
      const today = new Date();
      const overdue = customerInvoices.reduce((sum, inv) => {
        const dueDate = new Date(inv.dueDate);
        const paidAmount = inv.paidAmount ? parseFloat(inv.paidAmount.toString()) : 0;
        const totalAmount = parseFloat(inv.amount.toString());
        if (dueDate < today && paidAmount < totalAmount) {
          return sum + (totalAmount - paidAmount);
        }
        return sum;
      }, 0);

      const creditLimit = parseFloat(customer.creditLimit?.toString() || "0");
      const creditUtilization = creditLimit > 0 ? (outstanding / creditLimit) * 100 : 0;

      return {
        ...customer,
        totalInvoiced,
        totalPaid,
        outstanding,
        overdue,
        creditLimit,
        creditUtilization: Math.round(creditUtilization * 100) / 100,
        invoiceCount: customerInvoices.length,
      };
    });

    return NextResponse.json({
      success: true,
      data: customersWithBalance,
    });

  } catch (error: any) {
    console.error("Failed to fetch customers:", error);
    const isDbSetupMissing = error.message?.includes("INVALID DATABASE URL");
    
    return NextResponse.json(
      { 
        success: false, 
        error: isDbSetupMissing ? "Database setup required" : "Failed to fetch customers",
        code: isDbSetupMissing ? "DB_CONNECTION_REQUIRED" : undefined
      },
      { status: isDbSetupMissing ? 400 : 500 }
    );
  }
}
