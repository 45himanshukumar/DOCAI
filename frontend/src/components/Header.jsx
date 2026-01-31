import { Bot, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              DocAI <span className="text-blue-400">Pro</span>
            </h1>
            <p className="text-xs text-blue-200 font-medium">Intelligent Document Analysis</p>
          </div>
        </div>
        
        {/* Simple Status Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-white/80 font-medium">System Online</span>
        </div>
      </div>
    </header>
  );
}