import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowRight, BarChart3, ShieldCheck, Zap, Layers } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }
  
  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Layers size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Takaada</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/sign-in" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Sign In</a>
          <a href="/sign-up" className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-all shadow-sm">
            Get Started
          </a>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Zap size={14} />
            <span>Next-Gen Financial Integration</span>
          </div>
          <h1 className="text-6xl lg:text-7xl font-bold text-slate-950 leading-[1.1] tracking-tight">
            Master Your <span className="text-blue-600">Receivables</span> with Ease.
          </h1>
          <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
            A powerful financial dashboard that connects your external accounting systems and provides actionable insights on your cash flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="/sign-up"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
            >
              Get Started for Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-900 hover:bg-slate-50 transition-all"
            >
              View Demo
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-blue-300 rounded-[2.5rem] opacity-20 blur-2xl" />
          <div className="relative glass-card rounded-[2rem] p-8 border-white/40 shadow-2xl overflow-hidden bg-white/70 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Total Outstanding</p>
                <p className="text-3xl font-bold text-slate-900">$1,248,500.00</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <BarChart3 size={24} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-white/40">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="font-semibold text-slate-700">Acme Corp</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">$45,000</p>
                  <p className="text-xs text-slate-500">Pending</p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600 font-bold">
                <ShieldCheck size={20} />
                <span>Secured by Clerk</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
