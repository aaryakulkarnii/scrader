# SCRADER AI Command Center 🌌

![SCRADER Command Center](https://img.shields.io/badge/Status-Operational-00FF88?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20Redis%20%7C%20PostgreSQL-1f2937?style=for-the-badge)

SCRADER is a next-generation AI-powered market intelligence and competitive analysis platform. Built for founders, investors, and strategists, SCRADER autonomously scouts the web, analyzes competitor data, and synthesizes strategic insights using advanced LLMs (powered by Groq).

## 🚀 Features

* **AI Command Hub**: Interrogate your market in natural language. Ask complex strategic questions and get real-time, context-aware answers powered by `llama3-70b-8192` via Groq.
* **Market Galaxy Visualization**: An interactive, 3D spatial mapping of your competitive landscape. See exactly where you stand against industry titans and emerging threats.
* **Autonomous Scout Agents**: Simply input a competitor's domain, and our background ARQ workers will deploy a suite of agents (Scout, Analyst, Sentiment, Hiring, and Opportunity) to scrape and analyze their digital footprint.
* **Opportunity Scout**: Automatically identify market gaps, emerging trends, undervalued competitors, and growth catalysts with calculated potential returns and confidence scores.
* **Real-Time Threat Assessment**: Tracks dynamic competitor metrics, momentum, and sentiment to assign strategic threat levels (Critical, High, Medium, Low).

## 🛠️ Architecture

* **Frontend**: Next.js 14, React, TailwindCSS, Lucide Icons, Custom Glassmorphism UI
* **Backend**: FastAPI (Python 3), SQLAlchemy (Async), PostgreSQL
* **Task Queue**: Redis + ARQ (Async Python Background Jobs)
* **AI & Intelligence**: Groq API (Llama 3 70B), Playwright (Web Scraping)

## 🏁 Getting Started

### Prerequisites
* Docker and Docker Compose
* Python 3.10+
* Node.js 18+ and npm
* A Groq API Key

### 1. Infrastructure (Database & Redis)
Spin up the local PostgreSQL and Redis instances:
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # On Windows
pip install -r requirements.txt

# Create a .env file and add your GROQ_API_KEY
echo "GROQ_API_KEY=your_key_here" > .env
```
Run the FastAPI server:
```bash
uvicorn app.main:app --reload --port 8000
```
Run the ARQ Background Worker (in a separate terminal):
```bash
arq worker.main.WorkerSettings
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to access the Command Center!

## 🧪 Seeding Data
Want to test the platform immediately? We've included a seed script that creates a demo user, provisions a project, and queues up scraping jobs for top companies (like Vercel, Figma, Stripe).
```bash
cd backend
python seed.py
```
Login with:
- **Email**: `demo@example.com`
- **Password**: `dummy`

---
*Built to outmaneuver the competition.*
