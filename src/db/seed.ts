import { getDb } from "./index";
import { customers, invoices, payments } from "./schema";
import { eq } from "drizzle-orm";

// Sample seed data for demo purposes
// This simulates data from an external accounting system

const seedCustomers = [
  { externalId: "CUST001", name: "Acme Corporation", email: "billing@acme.com", phone: "+91-9876543210", creditLimit: "500000" },
  { externalId: "CUST002", name: "TechStart Industries", email: "accounts@techstart.in", phone: "+91-9123456789", creditLimit: "300000" },
  { externalId: "CUST003", name: "Global Traders Ltd", email: "finance@globaltraders.com", phone: "+91-9988776655", creditLimit: "750000" },
  { externalId: "CUST004", name: "Retail Solutions Pvt", email: "payments@retailsolutions.in", phone: "+91-9765432108", creditLimit: "200000" },
  { externalId: "CUST005", name: "Metro Distributors", email: "billing@metrodist.com", phone: "+91-9654321087", creditLimit: "400000" },
];

const seedInvoices = [
  // Acme Corporation invoices
  { externalId: "INV001", customerExternalId: "CUST001", invoiceNumber: "INV-2025-001", amount: "125000", dueDate: "2025-12-15", status: "paid" },
  { externalId: "INV002", customerExternalId: "CUST001", invoiceNumber: "INV-2025-045", amount: "87500", dueDate: "2026-01-10", status: "pending" },
  { externalId: "INV003", customerExternalId: "CUST001", invoiceNumber: "INV-2026-012", amount: "215000", dueDate: "2026-02-28", status: "pending" },
  { externalId: "INV004", customerExternalId: "CUST001", invoiceNumber: "INV-2026-089", amount: "45000", dueDate: "2026-03-05", status: "overdue" },
  
  // TechStart Industries invoices
  { externalId: "INV005", customerExternalId: "CUST002", invoiceNumber: "INV-2025-078", amount: "95000", dueDate: "2025-11-20", status: "overdue" },
  { externalId: "INV006", customerExternalId: "CUST002", invoiceNumber: "INV-2026-023", amount: "167000", dueDate: "2026-02-15", status: "pending" },
  { externalId: "INV007", customerExternalId: "CUST002", invoiceNumber: "INV-2026-056", amount: "34500", dueDate: "2026-03-20", status: "pending" },
  
  // Global Traders Ltd invoices
  { externalId: "INV008", customerExternalId: "CUST003", invoiceNumber: "INV-2025-112", amount: "450000", dueDate: "2025-12-01", status: "paid" },
  { externalId: "INV009", customerExternalId: "CUST003", invoiceNumber: "INV-2026-034", amount: "189000", dueDate: "2026-01-25", status: "overdue" },
  { externalId: "INV010", customerExternalId: "CUST003", invoiceNumber: "INV-2026-067", amount: "276000", dueDate: "2026-03-15", status: "pending" },
  
  // Retail Solutions Pvt invoices
  { externalId: "INV011", customerExternalId: "CUST004", invoiceNumber: "INV-2026-008", amount: "78000", dueDate: "2026-02-10", status: "overdue" },
  { externalId: "INV012", customerExternalId: "CUST004", invoiceNumber: "INV-2026-045", amount: "52000", dueDate: "2026-03-25", status: "pending" },
  
  // Metro Distributors invoices
  { externalId: "INV013", customerExternalId: "CUST005", invoiceNumber: "INV-2025-156", amount: "320000", dueDate: "2025-12-20", status: "paid" },
  { externalId: "INV014", customerExternalId: "CUST005", invoiceNumber: "INV-2026-019", amount: "145000", dueDate: "2026-02-05", status: "overdue" },
  { externalId: "INV015", customerExternalId: "CUST005", invoiceNumber: "INV-2026-078", amount: "98000", dueDate: "2026-03-30", status: "pending" },
];

const seedPayments = [
  // Payments for Acme Corporation
  { externalId: "PAY001", invoiceExternalId: "INV001", amount: "125000", paymentDate: "2025-12-10", paymentMethod: "UPI" },
  { externalId: "PAY002", invoiceExternalId: "INV001", amount: "50000", paymentDate: "2025-12-05", paymentMethod: "NEFT" }, // Partial payment example (already paid via PAY001)
  
  // Payments for Global Traders Ltd
  { externalId: "PAY003", invoiceExternalId: "INV008", amount: "450000", paymentDate: "2025-11-28", paymentMethod: "NEFT" },
  
  // Payments for Metro Distributors
  { externalId: "PAY004", invoiceExternalId: "INV013", amount: "320000", paymentDate: "2025-12-18", paymentMethod: "UPI" },
  
  // Partial payments for overdue invoices
  { externalId: "PAY005", invoiceExternalId: "INV005", amount: "30000", paymentDate: "2025-12-15", paymentMethod: "Cash" },
  { externalId: "PAY006", invoiceExternalId: "INV009", amount: "50000", paymentDate: "2026-02-01", paymentMethod: "UPI" },
];

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");
  const db = getDb();
  
  try {
    // Clear existing data
    await db.delete(payments);
    await db.delete(invoices);
    await db.delete(customers);
    console.log("🧹 Cleared existing data");
    
    // Insert customers
    const insertedCustomers = await db.insert(customers).values(seedCustomers).returning();
    console.log(`✅ Inserted ${insertedCustomers.length} customers`);
    
    // Create a map for customer lookup
    const customerMap = new Map(insertedCustomers.map(c => [c.externalId, c.id]));
    
    // Insert invoices
    const invoicesToInsert = seedInvoices.map(inv => ({
      externalId: inv.externalId,
      customerId: customerMap.get(inv.customerExternalId)!,
      invoiceNumber: inv.invoiceNumber,
      amount: inv.amount,
      dueDate: inv.dueDate,
      status: inv.status,
    }));
    
    const insertedInvoices = await db.insert(invoices).values(invoicesToInsert).returning();
    console.log(`✅ Inserted ${insertedInvoices.length} invoices`);
    
    // Create a map for invoice lookup
    const invoiceMap = new Map(insertedInvoices.map(inv => [inv.externalId, inv.id]));
    
    // Insert payments
    const paymentsToInsert = seedPayments.map(pay => ({
      externalId: pay.externalId,
      invoiceId: invoiceMap.get(pay.invoiceExternalId)!,
      amount: pay.amount,
      paymentDate: pay.paymentDate,
      paymentMethod: pay.paymentMethod,
    }));
    
    const insertedPayments = await db.insert(payments).values(paymentsToInsert).returning();
    console.log(`✅ Inserted ${insertedPayments.length} payments`);
    
    // Update paid amounts for invoices
    for (const invoice of insertedInvoices) {
      const invoicePayments = insertedPayments.filter(p => p.invoiceId === invoice.id);
      const totalPaid = invoicePayments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
      
      if (totalPaid > 0) {
        await db.update(invoices)
          .set({ paidAmount: totalPaid.toFixed(2), updatedAt: new Date() })
          .where(eq(invoices.id, invoice.id));
      }
    }
    
    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Customers: ${insertedCustomers.length}`);
    console.log(`   Invoices: ${insertedInvoices.length}`);
    console.log(`   Payments: ${insertedPayments.length}`);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if called directly
if (process.argv[1]?.includes("seed.ts")) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
