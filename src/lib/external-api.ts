import axios from "axios";

// External Accounting System API Configuration
// In production, this would be the actual external system's API
const EXTERNAL_API_BASE = process.env.EXTERNAL_API_URL || "https://api.accounting-system.com";

// Types for external API responses
export interface ExternalCustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  credit_limit?: string;
}

export interface ExternalInvoice {
  id: string;
  customer_id: string;
  invoice_number: string;
  amount: string;
  paid_amount?: string;
  due_date: string;
  status: "paid" | "pending" | "overdue";
}

export interface ExternalPayment {
  id: string;
  invoice_id: string;
  amount: string;
  payment_date: string;
  payment_method?: string;
}

// Simulated external API service
// In production, this would make actual HTTP calls to the external system
export class ExternalApiService {
  private static instance: ExternalApiService;
  
  private constructor() {}
  
  static getInstance(): ExternalApiService {
    if (!ExternalApiService.instance) {
      ExternalApiService.instance = new ExternalApiService();
    }
    return ExternalApiService.instance;
  }

  // Fetch all customers from external system
  async fetchCustomers(): Promise<ExternalCustomer[]> {
    try {
      // In production: const response = await axios.get(`${EXTERNAL_API_BASE}/customers`);
      // For demo, return simulated data
      return [
        { id: "CUST001", name: "Acme Corporation", email: "billing@acme.com", phone: "+91-9876543210", credit_limit: "500000" },
        { id: "CUST002", name: "TechStart Industries", email: "accounts@techstart.in", phone: "+91-9123456789", credit_limit: "300000" },
        { id: "CUST003", name: "Global Traders Ltd", email: "finance@globaltraders.com", phone: "+91-9988776655", credit_limit: "750000" },
        { id: "CUST004", name: "Retail Solutions Pvt", email: "payments@retailsolutions.in", phone: "+91-9765432108", credit_limit: "200000" },
        { id: "CUST005", name: "Metro Distributors", email: "billing@metrodist.com", phone: "+91-9654321087", credit_limit: "400000" },
      ];
    } catch (error) {
      console.error("Failed to fetch customers from external API:", error);
      throw new Error("Failed to sync customers");
    }
  }

  // Fetch all invoices from external system
  async fetchInvoices(): Promise<ExternalInvoice[]> {
    try {
      // In production: const response = await axios.get(`${EXTERNAL_API_BASE}/invoices`);
      return [
        { id: "INV001", customer_id: "CUST001", invoice_number: "INV-2025-001", amount: "125000", due_date: "2025-12-15", status: "paid" },
        { id: "INV002", customer_id: "CUST001", invoice_number: "INV-2025-045", amount: "87500", due_date: "2026-01-10", status: "pending" },
        { id: "INV003", customer_id: "CUST001", invoice_number: "INV-2026-012", amount: "215000", due_date: "2026-02-28", status: "pending" },
        { id: "INV004", customer_id: "CUST001", invoice_number: "INV-2026-089", amount: "45000", due_date: "2026-03-05", status: "overdue" },
        { id: "INV005", customer_id: "CUST002", invoice_number: "INV-2025-078", amount: "95000", due_date: "2025-11-20", status: "overdue" },
        { id: "INV006", customer_id: "CUST002", invoice_number: "INV-2026-023", amount: "167000", due_date: "2026-02-15", status: "pending" },
        { id: "INV007", customer_id: "CUST002", invoice_number: "INV-2026-056", amount: "34500", due_date: "2026-03-20", status: "pending" },
        { id: "INV008", customer_id: "CUST003", invoice_number: "INV-2025-112", amount: "450000", due_date: "2025-12-01", status: "paid" },
        { id: "INV009", customer_id: "CUST003", invoice_number: "INV-2026-034", amount: "189000", due_date: "2026-01-25", status: "overdue" },
        { id: "INV010", customer_id: "CUST003", invoice_number: "INV-2026-067", amount: "276000", due_date: "2026-03-15", status: "pending" },
        { id: "INV011", customer_id: "CUST004", invoice_number: "INV-2026-008", amount: "78000", due_date: "2026-02-10", status: "overdue" },
        { id: "INV012", customer_id: "CUST004", invoice_number: "INV-2026-045", amount: "52000", due_date: "2026-03-25", status: "pending" },
        { id: "INV013", customer_id: "CUST005", invoice_number: "INV-2025-156", amount: "320000", due_date: "2025-12-20", status: "paid" },
        { id: "INV014", customer_id: "CUST005", invoice_number: "INV-2026-019", amount: "145000", due_date: "2026-02-05", status: "overdue" },
        { id: "INV015", customer_id: "CUST005", invoice_number: "INV-2026-078", amount: "98000", due_date: "2026-03-30", status: "pending" },
      ];
    } catch (error) {
      console.error("Failed to fetch invoices from external API:", error);
      throw new Error("Failed to sync invoices");
    }
  }

  // Fetch all payments from external system
  async fetchPayments(): Promise<ExternalPayment[]> {
    try {
      // In production: const response = await axios.get(`${EXTERNAL_API_BASE}/payments`);
      return [
        { id: "PAY001", invoice_id: "INV001", amount: "125000", payment_date: "2025-12-10", payment_method: "UPI" },
        { id: "PAY003", invoice_id: "INV008", amount: "450000", payment_date: "2025-11-28", payment_method: "NEFT" },
        { id: "PAY004", invoice_id: "INV013", amount: "320000", payment_date: "2025-12-18", payment_method: "UPI" },
        { id: "PAY005", invoice_id: "INV005", amount: "30000", payment_date: "2025-12-15", payment_method: "Cash" },
        { id: "PAY006", invoice_id: "INV009", amount: "50000", payment_date: "2026-02-01", payment_method: "UPI" },
      ];
    } catch (error) {
      console.error("Failed to fetch payments from external API:", error);
      throw new Error("Failed to sync payments");
    }
  }

  // Fetch all data in one call (for efficient syncing)
  async fetchAllData() {
    const [customers, invoices, payments] = await Promise.all([
      this.fetchCustomers(),
      this.fetchInvoices(),
      this.fetchPayments(),
    ]);
    
    return { customers, invoices, payments };
  }
}

export const externalApi = ExternalApiService.getInstance();
