import { pgTable, text, integer, decimal, timestamp, uuid, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Customers table - stores customer information from external accounting system
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: text("external_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Invoices table - stores invoice data
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: text("external_id").notNull().unique(),
  customerId: uuid("customer_id").notNull().references(() => customers.id),
  invoiceNumber: text("invoice_number").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }).default("0"),
  dueDate: date("due_date").notNull(),
  status: text("status").notNull().default("pending"), // paid, pending, overdue
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Payments table - stores payment records
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: text("external_id").notNull().unique(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentDate: date("payment_date").notNull(),
  paymentMethod: text("payment_method"), // UPI, NEFT, Cash, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
}));

// Type exports
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
