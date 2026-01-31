import { Upload, Loader2, FileType, CheckCircle } from "lucide-react";

export default function UploadCard({ onUpload, file, setFile, uploading }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-white/20">
      {/* Card Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h2 className="font-bold text-slate-700 flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" /> 
          Upload Source
        </h2>
        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">Supported: PDF, MP4, MP3</span>
      </div>
      
      <div className="p-6">
        <label className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 group ${file ? 'border-green-500 bg-green-50/30' : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'}`}>
          
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10">
            {file ? (
               <>
                 <div className="mb-3 p-3 rounded-full bg-green-100 text-green-600 shadow-sm">
                   <CheckCircle className="w-8 h-8" />
                 </div>
                 <p className="text-sm font-semibold text-slate-700">{file.name}</p>
                 <p className="text-xs text-slate-500 mt-1">Ready to analyze</p>
               </>
            ) : (
               <>
                 <div className="mb-3 p-3 rounded-full bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                   <FileType className="w-8 h-8" />
                 </div>
                 <p className="mb-1 text-sm text-slate-600 font-medium">
                   Drop your file here, or <span className="text-blue-600 font-bold">browse</span>
                 </p>
                 <p className="text-xs text-slate-400">Maximum size: 50MB</p>
               </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={(e) => setFile(e.target.files[0])} 
          />
        </label>

        {/* Action Button */}
        <button 
          onClick={onUpload}
          disabled={uploading || !file}
          className={`w-full mt-4 py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${
            !file 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin"/> : "Process Document"}
        </button>
      </div>
    </div>
  );
}