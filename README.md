# Takaada Integration - Receivables Dashboard

A full-stack financial integration service that connects with external accounting systems, syncs customer/invoice/payment data, and provides actionable insights on receivables and overdue payments.

## 🚀 Tech Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| **Framework** | Next.js 16 (App Router) | Full-stack capabilities, API routes, server components |
| **Runtime** | Bun | Fast JavaScript runtime, npm-compatible |
| **Language** | TypeScript | Type safety, better developer experience |
| **Database** | Neon DB | Serverless PostgreSQL, branching, auto-scaling |
| **ORM** | Drizzle ORM | Lightweight, type-safe, excellent Neon support |
| **Authentication** | Clerk | Pre-built components, secure, easy integration |
| **UI** | Shadcn UI + Tailwind CSS | Copy-paste components, accessible, customizable |
| **Validation** | Zod | Schema validation at API boundaries |

## 📋 Features

- **External API Integration**: Syncs customers, invoices, and payments from external accounting systems
- **Idempotent Sync**: Uses `external_id` for upserts, safe to run multiple times
- **Financial Insights Dashboard**:
  - Total invoiced, paid, outstanding, and overdue amounts
  - Accounts receivable aging buckets (0-30, 31-60, 61-90, 90+ days)
  - Collection rate tracking
  - Per-customer outstanding balances
  - Credit utilization monitoring
- **Protected Routes**: Clerk authentication for all dashboard pages
- **Responsive UI**: Works on desktop and mobile

## 🛠️ Setup Instructions

### Prerequisites

- [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash` on Mac/Linux, `powershell -c "irm bun.sh/install.ps1|iex"` on Windows)
- [Neon DB](https://neon.tech) account (free tier works)
- [Clerk](https://clerk.com) account (free tier works)

### 1. Clone and Install

```bash
cd takaada-integration
bun install
```

### 2. Set Up Neon DB

1. Go to [neon.tech](https://neon.tech) and create a new project
2. Copy the connection string (looks like `postgresql://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require`)

### 3. Set Up Clerk

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) and create a new application
2. Go to **API Keys** in the sidebar
3. Copy the **Publishable Key** and **Secret Key**
4. Configure sign-in options:
   - Go to **User & Authentication** → **Email, Phone, Username**
   - Enable email and/or phone sign-in

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update with your credentials:

```env
DATABASE_URL="postgresql://your-neon-connection-string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_key"
CLERK_SECRET_KEY="sk_test_your_key"
```

### 5. Run Database Migrations and Seed

```bash
# Generate migration files
bun run db:generate

# Apply migrations to Neon DB
bun run db:migrate

# Seed with demo data (optional - you can also use the UI sync button)
bun run db:seed
```

### 6. Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 API Endpoints

### Sync Data
```
POST /api/sync
```
Triggers sync with external accounting system. Idempotent - safe to call multiple times.

**Response:**
```json
{
  "success": true,
  "message": "Sync completed successfully",
  "data": {
    "customers": 5,
    "invoices": 15,
    "payments": 5
  }
}
```

### Get Financial Insights
```
GET /api/insights
```
Returns overall financial metrics and aging analysis.

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalInvoiced": 2377000,
      "totalPaid": 980000,
      "totalOutstanding": 1397000,
      "totalOverdue": 649500
    },
    "agingBuckets": {
      "current": 0,
      "0-30 days": 189000,
      "31-60 days": 230000,
      "61-90 days": 152000,
      "90+ days": 78500
    },
    "stats": {
      "totalCustomers": 5,
      "totalInvoices": 15,
      "pendingInvoices": 8,
      "paidInvoices": 3,
      "overdueInvoices": 5
    }
  }
}
```

### Get Customers
```
GET /api/customers
```
Returns all customers with outstanding balances and credit utilization.

## 🗄️ Database Schema

```
┌─────────────────┐
│    customers    │
├─────────────────┤
│ id (PK, UUID)   │
│ external_id     │ ← From external system
│ name            │
│ email           │
│ phone           │
│ credit_limit    │
│ created_at      │
│ updated_at      │
└─────────────────┘

┌─────────────────┐
│    invoices     │
├─────────────────┤
│ id (PK, UUID)   │
│ external_id     │ ← From external system
│ customer_id (FK)│
│ invoice_number  │
│ amount          │
│ paid_amount     │
│ due_date        │
│ status          │
│ created_at      │
│ updated_at      │
└─────────────────┘

┌─────────────────┐
│    payments     │
├─────────────────┤
│ id (PK, UUID)   │
│ external_id     │ ← From external system
│ invoice_id (FK) │
│ amount          │
│ payment_date    │
│ payment_method  │
│ created_at      │
└─────────────────┘
```

## 🏗️ Architecture Decisions

### Why Neon DB?
- **Serverless PostgreSQL**: No infrastructure to manage, auto-scales
- **Branching**: Create database branches for development/testing
- **Free tier**: Generous free tier for demos and small projects
- **Type-safe**: Works seamlessly with Drizzle ORM

### Why Clerk?
- **Pre-built components**: Sign-in, sign-up, user profile out of the box
- **Security**: Handles password resets, MFA, session management
- **Developer experience**: Simple middleware integration
- **Free tier**: Up to 10,000 monthly active users free

### Why Drizzle ORM?
- **Lightweight**: ~5x smaller than Prisma
- **Type-safe**: Full TypeScript support
- **SQL-like**: Write queries that feel like raw SQL
- **Neon support**: First-class support for serverless Postgres

### Idempotent Sync Design
The sync endpoint uses `external_id` fields to ensure:
- Running sync multiple times doesn't create duplicates
- Updates existing records when external data changes
- Safe for retry logic and cron jobs

### Data Flow
```
External API → Sync Service → Neon DB → Insights API → Dashboard UI
                                    ↓
                              Clerk Auth
```

## 🔒 Security Considerations

- **Authentication**: All dashboard routes protected by Clerk
- **API Protection**: Sync endpoint can be rate-limited or protected
- **Environment Variables**: Secrets never committed to git
- **SQL Injection**: Prevented by Drizzle ORM's parameterized queries
- **HTTPS**: Required for production (Vercel/Neon enforce this)

## 🧪 Testing the Demo

1. **Sign up** for a Clerk account at `/sign-up`
2. **Sign in** at `/sign-in`
3. Click **"Sync Data"** to import demo data
4. View the dashboard with:
   - Summary cards (invoiced, paid, outstanding, overdue)
   - Aging buckets visualization
   - Customer list with credit utilization
   - Collection rate metrics

## 📦 Scripts

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run db:generate  # Generate Drizzle migrations
bun run db:migrate   # Apply migrations to Neon
bun run db:seed      # Seed database with demo data
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
- `DATABASE_URL`: Your Neon production connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk production key
- `CLERK_SECRET_KEY`: Clerk production secret

## 📝 Edge Cases Handled

1. **Duplicate Syncs**: Idempotent upserts by `external_id`
2. **Missing References**: Skips payments/invoices if parent not found
3. **Partial Payments**: Supports multiple payments per invoice
4. **Timezone Handling**: Dates stored in database timezone
5. **External API Failures**: Graceful error handling with logging

## 🎯 Future Enhancements

- [ ] Cron-based automatic sync (Vercel Cron / GitHub Actions)
- [ ] Webhook support for real-time updates from external system
- [ ] Export to CSV/PDF
- [ ] Email alerts for overdue invoices
- [ ] Customer portal for self-service payment tracking
- [ ] Multi-currency support
- [ ] Advanced analytics (DSO, collection effectiveness index)

---

**Built for the Takaada Integration Engineer Take-Home Assessment**

*Demonstrates: External API integration, data modeling, clean architecture, and thoughtful design decisions.*
#   t a k a d a  
 