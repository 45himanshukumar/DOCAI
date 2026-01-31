import { FileVideo } from "lucide-react";

export default function MediaPlayer({ uploadedDoc, mediaRef }) {
  if (!uploadedDoc) return null;
  const isMedia = uploadedDoc.fileType.includes("video") || uploadedDoc.fileType.includes("audio");

  if (!isMedia) return null;

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/20 border border-gray-800 relative group">
      <video 
        ref={mediaRef} 
        controls 
        className="w-full aspect-video object-contain bg-black/50"
        src={`http://localhost:8080/uploads/${uploadedDoc.fileName}`} 
      />
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
        <FileVideo className="w-3 h-3 text-blue-400" />
        <span className="text-xs font-medium text-white/90 truncate max-w-[150px]">
          {uploadedDoc.fileName}
        </span>
      </div>
    </div>
  );
}