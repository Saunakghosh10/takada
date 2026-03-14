# Takaada Integration Dashboard 🚀

A premium, modern financial management dashboard built with **Next.js 16**, **Drizzle ORM**, **Neon Database**, and **Clerk Authentication**. This application provides real-time financial insights, customer risk profiling, and advanced reporting with data export capabilities.

![Dashboard Preview](https://github.com/Saunakghosh10/takada/raw/main/public/preview.png) *(Note: Add a real preview image to the public folder if available)*

## ✨ Features

-   **💎 Premium UI/UX**: Designed with a sleek glassmorphism aesthetic, custom "Outfit" typography, and responsive layouts.
-   **📊 Financial Insights**: Real-time overview of total invoiced, paid, outstanding, and overdue amounts.
-   **📅 Aging Analysis**: Interactive breakdown of receivables by duration (0-30, 31-60, 61-90, 90+ days).
-   **👥 Customer Management**: Searchable list of accounts with health ratings and credit utilization monitoring.
-   **📈 Advanced Reporting**: Visual trends of revenue and collection efficiency.
-   **📥 CSV Export**: One-click data portability for customer lists and risk profiles.
-   **🔐 Secure Auth**: Robust authentication and route protection powered by Clerk.
-   **☁️ Serverless DB**: High-performance PostgreSQL integration via Neon.tech.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
-   **Database**: [Neon PostgreSQL](https://neon.tech/)
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **Auth**: [Clerk](https://clerk.dev/)
-   **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Package Manager**: [Bun](https://bun.sh/)

## 🚀 Getting Started

### Prerequisites

-   Bun installed on your machine
-   A Neon.tech database account
-   A Clerk account for authentication

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Saunakghosh10/takada.git
    cd takada
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your credentials:
    ```env
    DATABASE_URL="your_neon_connection_string"
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
    CLERK_SECRET_KEY="your_clerk_secret_key"
    ```

4.  **Push Database Schema:**
    ```bash
    bun x drizzle-kit push
    ```

5.  **Run Development Server:**
    ```bash
    bun dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is licensed under the MIT License.

---
Built with ❤️ by [Saunakghosh10](https://github.com/Saunakghosh10)