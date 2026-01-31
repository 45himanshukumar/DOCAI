import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Bot, User, Play, Loader2, Sparkles } from "lucide-react";

export default function ChatInterface({ chatHistory, query, setQuery, handleChat, loading, jumpToTime }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="flex flex-col h-[700px] bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-white/20">
      
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">AI Assistant</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Always active
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
             <Bot className="w-16 h-16 text-slate-300 mb-4" />
             <p className="text-slate-500 font-medium">No messages yet</p>
          </div>
        ) : (
          chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {/* Bot Icon */}
              {msg.role === 'bot' && (
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md border-2 border-white mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Message Bubble */}
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
              }`}>
                <div className={`prose ${msg.role === 'user' ? 'prose-invert' : 'prose-slate'} max-w-none prose-sm`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>

                {/* Timestamps */}
                {msg.timestamps && msg.timestamps.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100/20 flex flex-wrap gap-2">
                    {msg.timestamps.map((time, tIdx) => (
                      <button 
                        key={tIdx}
                        onClick={() => jumpToTime(time)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            msg.role === 'user' 
                            ? 'bg-white/20 hover:bg-white/30 text-white' 
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" /> 
                        {Math.floor(time / 60)}:{Math.floor(time % 60).toString().padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Icon */}
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-md border-2 border-white mt-1">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-2">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleChat()}
            disabled={loading}
            placeholder="Ask a question about your file..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-4 pr-14 transition-all"
          />
          <button 
            onClick={handleChat}
            disabled={loading || !query.trim()}
            className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md shadow-blue-500/30"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}