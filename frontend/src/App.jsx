import { useState, useRef } from "react";
import axios from "axios";
import Header from "./components/Header";
import UploadCard from "./components/UploadCard";
import MediaPlayer from "./components/MediaPlayer";
import SummaryCard from "./components/SummaryCard";
import ChatInterface from "./components/ChatInterface";

const API_URL = "http://localhost:8081/api";

function App() {
  const [file, setFile] = useState(null);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [summary, setSummary] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const mediaRef = useRef(null);

  const handleUpload = async (e) => {
    e?.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedDoc(res.data);
      fetchSummary(res.data.id);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Make sure backend is running.");
    } finally {
      setUploading(false);
    }
  };

  const fetchSummary = async (fileId) => {
    try {
      const res = await axios.get(`${API_URL}/summarize/${fileId}`);
      setSummary(res.data);
    } catch (err) {
      console.error("Summary failed", err);
    }
  };

  const handleChat = async () => {
    if (!query.trim()) return;

    const userMessage = { role: "user", text: query };
    setChatHistory((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat`, { query });
      const botMessage = { 
        role: "bot", 
        text: res.data.answer, 
        timestamps: res.data.relevantTimestamps || [] 
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      setChatHistory((prev) => [...prev, { role: "bot", text: "**Error:** Could not connect to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  const jumpToTime = (seconds) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = seconds;
      mediaRef.current.play();
    }
  };

  return (
    <div className="min-h-screen font-sans pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Media & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <UploadCard 
            file={file} 
            setFile={setFile} 
            onUpload={handleUpload} 
            uploading={uploading} 
          />
          
          <MediaPlayer 
            uploadedDoc={uploadedDoc} 
            mediaRef={mediaRef} 
          />
          
          <SummaryCard summary={summary} />
        </div>

        {/* Right Column: Chat */}
        <div className="lg:col-span-7">
          <ChatInterface 
            chatHistory={chatHistory}
            query={query}
            setQuery={setQuery}
            handleChat={handleChat}
            loading={loading}
            jumpToTime={jumpToTime}
          />
        </div>

      </main>
    </div>
  );
}

export default App;