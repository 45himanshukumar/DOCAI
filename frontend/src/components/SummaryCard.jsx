import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";

export default function SummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="font-bold text-amber-900">AI Summary</h3>
      </div>
      <div className="p-6 text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
      </div>
    </div>
  );
}