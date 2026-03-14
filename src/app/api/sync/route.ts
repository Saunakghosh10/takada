import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { customers, invoices, payments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { externalApi } from "@/lib/external-api";

/**
 * POST /api/sync
 * Syncs data from external accounting system
 * Idempotent - uses external_id for upserts
 */
export async function POST() {
  try {
    const db = getDb();
    console.log("🔄 Starting sync with external system...");
    
    // Fetch data from external API
    const externalData = await externalApi.fetchAllData();
    console.log(`📥 Fetched ${externalData.customers.length} customers, ${externalData.invoices.length} invoices, ${externalData.payments.length} payments`);
    
    // Sync customers (upsert by external_id)
    for (const extCustomer of externalData.customers) {
      const existing = await db.query.customers.findFirst({
        where: eq(customers.externalId, extCustomer.id),
      });
      
      if (existing) {
        await db.update(customers)
          .set({
            name: extCustomer.name,
            email: extCustomer.email,
            phone: extCustomer.phone,
            creditLimit: extCustomer.credit_limit || "0",
            updatedAt: new Date(),
          })
          .where(eq(customers.externalId, extCustomer.id));
      } else {
        await db.insert(customers).values({
          externalId: extCustomer.id,
          name: extCustomer.name,
          email: extCustomer.email,
          phone: extCustomer.phone,
          creditLimit: extCustomer.credit_limit || "0",
        });
      }
    }
    
    // Get customer ID mapping
    const allCustomers = await db.query.customers.findMany();
    const customerMap = new Map(allCustomers.map(c => [c.externalId, c.id]));
    
    // Sync invoices (upsert by external_id)
    for (const extInvoice of externalData.invoices) {
      const existing = await db.query.invoices.findFirst({
        where: eq(invoices.externalId, extInvoice.id),
      });
      
      const customerId = customerMap.get(extInvoice.customer_id);
      if (!customerId) {
        console.warn(`⚠️ Skipping invoice ${extInvoice.id} - customer ${extInvoice.customer_id} not found`);
        continue;
      }
      
      if (existing) {
        await db.update(invoices)
          .set({
            invoiceNumber: extInvoice.invoice_number,
            amount: extInvoice.amount,
            dueDate: extInvoice.due_date,
            status: extInvoice.status,
            updatedAt: new Date(),
          })
          .where(eq(invoices.externalId, extInvoice.id));
      } else {
        await db.insert(invoices).values({
          externalId: extInvoice.id,
          customerId,
          invoiceNumber: extInvoice.invoice_number,
          amount: extInvoice.amount,
          dueDate: extInvoice.due_date,
          status: extInvoice.status,
        });
      }
    }
    
    // Get invoice ID mapping
    const allInvoices = await db.query.invoices.findMany();
    const invoiceMap = new Map(allInvoices.map(inv => [inv.externalId, inv.id]));
    
    // Sync payments (upsert by external_id)
    for (const extPayment of externalData.payments) {
      const existing = await db.query.payments.findFirst({
        where: eq(payments.externalId, extPayment.id),
      });
      
      const invoiceId = invoiceMap.get(extPayment.invoice_id);
      if (!invoiceId) {
        console.warn(`⚠️ Skipping payment ${extPayment.id} - invoice ${extPayment.invoice_id} not found`);
        continue;
      }
      
      if (existing) {
        await db.update(payments)
          .set({
            amount: extPayment.amount,
            paymentDate: extPayment.payment_date,
            paymentMethod: extPayment.payment_method,
          })
          .where(eq(payments.externalId, extPayment.id));
      } else {
        await db.insert(payments).values({
          externalId: extPayment.id,
          invoiceId,
          amount: extPayment.amount,
          paymentDate: extPayment.payment_date,
          paymentMethod: extPayment.payment_method,
        });
      }
    }
    
    // Update paid amounts for all invoices
    for (const invoice of allInvoices) {
      const invoicePayments = await db.query.payments.findMany({
        where: eq(payments.invoiceId, invoice.id),
      });
      
      const totalPaid = invoicePayments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
      
      await db.update(invoices)
        .set({ 
          paidAmount: totalPaid.toFixed(2),
          updatedAt: new Date(),
        })
        .where(eq(invoices.id, invoice.id));
    }
    
    console.log("✅ Sync completed successfully");
    
    return NextResponse.json({
      success: true,
      message: "Sync completed successfully",
      data: {
        customers: externalData.customers.length,
        invoices: externalData.invoices.length,
        payments: externalData.payments.length,
      },
    });
    
  } catch (error) {
    console.error("❌ Sync failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Sync failed",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to trigger sync",
    endpoints: {
      sync: "POST /api/sync",
      insights: "GET /api/insights",
      customers: "GET /api/customers",
    },
  });
}
