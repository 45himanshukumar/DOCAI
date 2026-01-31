# DocAI Pro - AI-Powered Document Q&A Platform

DocAI Pro is a full-stack application that allows users to upload Documents (PDF) and Multimedia (Audio/Video), interacts with an AI chatbot to ask questions, and jump to specific timestamps in media files based on AI answers.

## 🚀 Features
- **Multi-Format Support**: Upload PDF, MP3, and MP4 files.
- **AI Chatbot**: Ask questions about your documents using Google Gemini.
- **Smart Summarization**: Get instant summaries of uploaded content.
- **Media Timestamping**: Click on citations to jump to the exact moment in a video/audio.
- **Vector Search**: Uses PostgreSQL `pgvector` for semantic search.

## 🛠 Tech Stack
- **Backend**: Java Spring Boot, Spring AI
- **Frontend**: React.js, Tailwind CSS
- **Database**: PostgreSQL (with pgvector extension)
- **AI Model**: Google Gemini Pro & Gemini 1.5 Flash
- **Infrastructure**: Docker & Docker Compose

---

## ⚙️ Setup & Installation

### Prerequisites
- Docker Desktop installed and running
- Java 17+ (for local development)
- Node.js (for frontend)
- A Google Gemini API Key

### 1. Clone the Repository
```bash
git clone <https://github.com/45himanshukumar/DOCAI>
cd docai-v2