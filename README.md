# ☁️ Cloud Computing Learning Assistant — Adaptive RAG

A production-ready full-stack AI application that serves as an intelligent Cloud Computing Learning Assistant, powered by **Adaptive Retrieval-Augmented Generation (RAG)**.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![Groq](https://img.shields.io/badge/LLM-Groq-orange) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Quick Start

```bash
# 1. Install all dependencies (root + backend + frontend)
npm install

# 2. Start both servers (backend on :5000, frontend on :5173)
npm run dev
```

On first startup, the application will automatically:
1. Generate 55+ cloud computing knowledge documents
2. Chunk all documents into searchable segments
3. Generate vector embeddings using Sentence Transformers
4. Build the vector index for semantic search
5. Be ready to answer questions — no manual uploads needed!

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────────────────────────┐
│                 │     │          Backend (Express.js)         │
│   React +       │     │                                      │
│   Tailwind CSS  │────▶│  REST API ──▶ Adaptive RAG Engine    │
│   (Vite)        │     │                 │          │          │
│                 │     │          ┌──────┘          ▼          │
└─────────────────┘     │          ▼          Groq LLM API     │
                        │   Vector Store                       │
                        │   (Embeddings)    LangSmith Tracing  │
                        │          │                            │
                        │          ▼                            │
                        │   MongoDB Atlas                      │
                        └──────────────────────────────────────┘
```

## 📚 Features

### Adaptive RAG Pipeline
- **Query Classification** — Automatically classifies queries as factual, comparison, explanation, or procedural
- **Hybrid Search** — Combines semantic similarity + keyword (BM25-style) matching
- **Context Reranking** — Re-scores retrieved chunks using the LLM for maximum relevance
- **Dynamic Top-K** — Adjusts retrieval depth based on query complexity
- **Source Citation** — Every answer includes source documents with confidence scores

### Knowledge Base (55+ Auto-Generated Documents)
| Category | Count | Topics |
|---|---|---|
| AWS | 15 | EC2, Lambda, S3, IAM, VPC, RDS, Route53, CloudFront, Auto Scaling, ELB, ECS, EKS, CloudWatch, Elastic Beanstalk, Security |
| Azure | 10 | VMs, Storage, Functions, Networking, Security, SQL, AKS, Active Directory, Monitor, DevOps |
| Google Cloud | 10 | Compute Engine, Cloud Storage, BigQuery, Cloud Functions, GKE, Cloud IAM, VPC, Monitoring, Security, Cloud Run |
| Docker | 5 | Basics, Images, Containers, Networking, Volumes |
| Kubernetes | 5 | Pods, Services, Deployments, ConfigMaps, Ingress |
| Cloud Security | 5 | CIA Triad, Authentication, Authorization, Encryption, Compliance |
| Virtualization | 5 | Hypervisors, VMs, Containerization, Cloud Networking, Deployment Models |

### User Interface
- 🌙 Dark mode with premium glassmorphism design
- 💬 Real-time chat with source references and confidence scores
- 📊 Evaluation dashboard with retrieval & answer quality metrics
- 🎓 Learning hub with quiz, MCQ, and interview question generation
- 📱 Fully responsive (mobile-friendly)
- 📥 Export chat history as PDF

### Evaluation Metrics
- **Retrieval**: Precision@5, Recall@5, MRR (Mean Reciprocal Rank)
- **Answer Quality**: Relevance, Faithfulness, Context Utilization, Completeness

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS 3, Vite, Recharts, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| LLM | Groq API (llama-3.3-70b-versatile) |
| Embeddings | @xenova/transformers (all-MiniLM-L6-v2) |
| Vector Store | Custom cosine similarity engine |
| Tracing | LangSmith |

## 📁 Project Structure

```
rag-project1/
├── package.json              # Root monorepo (concurrently)
├── .env                      # Environment variables
├── README.md
├── backend/
│   ├── server.js             # Express entry point
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Request handlers
│   ├── routes/               # API route definitions
│   ├── models/               # Mongoose schemas
│   ├── services/             # Business logic
│   │   ├── documentGenerator.js   # 55 doc generator
│   │   ├── documentChunker.js     # Text chunking
│   │   ├── embeddingService.js    # Vector embeddings
│   │   ├── vectorStore.js         # Similarity search
│   │   ├── adaptiveRAG.js         # RAG pipeline
│   │   ├── learningService.js     # Quiz/MCQ/Interview
│   │   └── evaluationService.js   # Metrics computation
│   ├── utils/                # Helpers & logger
│   ├── documents/            # Auto-generated (runtime)
│   ├── vector-db/            # Persisted vectors (runtime)
│   └── embeddings/           # Cached embeddings (runtime)
└── frontend/
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # Route pages
    │   ├── services/api.js   # API client
    │   └── index.css         # Tailwind + custom styles
    └── index.html
```

## 🔌 API Documentation

### Chat
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send a message and get RAG response |
| GET | `/api/chat/history` | List all chat sessions |
| GET | `/api/chat/:sessionId` | Get specific chat session |
| DELETE | `/api/chat/:sessionId` | Delete a chat session |

### Learning
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/learning/summarize` | Summarize a cloud topic |
| POST | `/api/learning/quiz` | Generate quiz questions |
| POST | `/api/learning/mcq` | Generate MCQs |
| POST | `/api/learning/interview` | Generate interview Q&A |

### Evaluation
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/evaluation/run` | Run full evaluation suite |
| GET | `/api/evaluation/results` | Get all evaluation results |
| GET | `/api/evaluation/latest` | Get most recent evaluation |

### System
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/status` | System readiness & stats |
| GET | `/api/documents` | List all documents |
| GET | `/api/documents/stats` | Document statistics |

## ⚙️ Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GROQ_API_KEY` | Groq API key for LLM |
| `LANGSMITH_TRACING` | Enable LangSmith tracing |
| `LANGSMITH_ENDPOINT` | LangSmith API endpoint |
| `LANGSMITH_API_KEY` | LangSmith API key |
| `LANGSMITH_PROJECT` | LangSmith project name |
| `PORT` | Backend server port (default: 5000) |

## 📄 License

MIT License — Built with ❤️ by Keerthi Sri
"# rag-project1" 
