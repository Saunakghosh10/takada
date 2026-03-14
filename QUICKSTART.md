# Quick Start Guide

## Step 1: Set up environment variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL="postgresql://your-connection-string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_SECRET_KEY="sk_test_xxx"
```

## Step 2: Install dependencies

```bash
bun install
```

## Step 3: Set up database

```bash
# Generate migrations
bun run db:generate

# Apply to Neon DB
bun run db:migrate

# Seed demo data
bun run db:seed
```

## Step 4: Run development server

```bash
bun run dev
```

Visit http://localhost:3000

## Step 5: Demo the application

1. **Sign up** for a Clerk account at `/sign-up`
2. **Sign in** at `/sign-in`
3. Click **"Sync Data"** button to import demo data
4. View the dashboard showing:
   - Total invoiced, paid, outstanding, overdue amounts
   - Aging buckets (0-30, 31-60, 61-90, 90+ days)
   - Customer list with credit utilization
   - Collection rate metrics

## Troubleshooting

### "DATABASE_URL must be set"
Make sure you have a `.env.local` file with your Neon DB connection string.

### Clerk authentication errors
- Make sure both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set
- Check that your Clerk application is configured correctly

### Build errors with Next.js 16
The project uses Next.js 16 with Turbopack. Run `bun run dev` for development.
For production builds, some Clerk components may need adjustment due to SSR changes.
