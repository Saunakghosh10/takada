import { AlertCircle, ExternalLink, Database, ArrowRight } from "lucide-react";

export default function DatabaseSetupRequired() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 animate-pulse">
        <Database size={32} />
      </div>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Database Connection Required</h2>
      <p className="text-slate-600 max-w-md mb-8 leading-relaxed">
        Your application is currently using a placeholder database URL. To see your financial data, you'll need to connect a real PostgreSQL database.
      </p>

      <div className="grid gap-4 w-full max-w-lg">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
          <div>
            <p className="font-semibold text-slate-900 flex items-center gap-2">
              Create a Neon Project
              <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                <ExternalLink size={14} />
              </a>
            </p>
            <p className="text-sm text-slate-500">Sign up at Neon.tech and create a new free project.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
          <div>
            <p className="font-semibold text-slate-900">Update .env File</p>
            <p className="text-sm text-slate-500">Copy your connection string and paste it into <code className="bg-slate-200 px-1 rounded">.env</code> as <code className="bg-slate-200 px-1 rounded">DATABASE_URL</code>.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
          <div>
            <p className="font-semibold text-slate-900">Push Schema</p>
            <p className="text-sm text-slate-500">Run <code className="bg-slate-200 px-1 rounded">bun x drizzle-kit push</code> in your terminal.</p>
          </div>
        </div>
      </div>

      <div className="mt-10 p-4 rounded-lg bg-blue-50 border border-blue-100 flex items-center gap-3 text-blue-700 text-sm">
        <AlertCircle size={18} />
        <p>I&apos;ve added a check in the code to detect once you&apos;ve updated the URL!</p>
      </div>
    </div>
  );
}
