# AI TaskPilot - AI Task Orchestration Platform

**AI TaskPilot** is an AI-powered platform that automatically analyzes user task descriptions in natural language, recommends the best combination of AI tools, and orchestrates them to deliver results. It integrates LangGraph-based workflows, RAG systems, and multiple AI APIs for intelligent task automation.

---

## 📁 Project Structure

```
AI-TaskPilot/
├── ai/                  # AI-related modules
│   ├── intention/       # Intent classification models
│   ├── pipelines/       # LangGraph-based workflow logic
│   ├── rag/             # Retrieval-Augmented Generation system
│   └── tools/           # Individual AI tools (e.g., translation, summarization)
│
├── backend/             # FastAPI backend
│   ├── api/             # API routes
│   ├── core/            # Settings, authentication
│   ├── models/          # Pydantic / SQLAlchemy models
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── main.py          # FastAPI entry point
│
├── data/                # Data processing and storage
│
├── frontend/            # Next.js frontend (TypeScript)
│   ├── src/
│   │   ├── app/         # Page routing
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom hooks
│   │   ├── store/       # Zustand or Redux store
│   │   └── utils/       # API calls, formatting, helpers
│   ├── public/          # Static files
│   └── ...
│
├── .env                 # Environment variables
└── README.md
```

---

## Tech Stack

### AI & Orchestration

- LangGraph, LangChain
- OpenAI API, Hugging Face Transformers
- FAISS / Pinecone (vector DBs)

### Backend

- FastAPI
- SQLAlchemy + MySQL
- Redis + Celery (for async jobs)

### Frontend

- Next.js (TypeScript)
- TailwindCSS
- Zustand or Redux
- Axios, React Query
- WebSocket (live updates)

---

## Getting Started

### 1. Set Environment Variables

Create a `.env` file with:

```env
OPENAI_API_KEY=your_api_key
PINECONE_API_KEY=your_pinecone_key
DATABASE_URL=mysql://user:pass@localhost/dbname
```

### 2. Start Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Development Progress

- [x] Project structure initialized
- [ ] Intent classifier (GPT-based)
- [ ] RAG document retriever & generator
- [ ] LangGraph-based pipeline system
- [ ] Frontend UI/UX and task visualizer

---

## Testing

- Backend: `pytest`
- Frontend: `Jest` + `React Testing Library`
- CI/CD: GitHub Actions (coming soon)

---

## Contribution Guidelines

- Use `feature/branch-name` naming for branches
- Every PR must be reviewed by at least one team member
- Follow commit message conventions: `feat:`, `fix:`, `refactor:`, etc.

---

## Team

| Role      | Name | Responsibilities                        |
| --------- | ---- | --------------------------------------- |
| Team Lead | Daniel Lee  | Architecture, AI pipeline, tech design  |
| Member  | Michael H. Kim  | Backend API, DB schema, data pipelines  |
| Member  | MJ Park  | Frontend UI/UX, workflow visualizations |

---

## 💬 Contact

For questions or support, please reach out via GitHub Issues or the team Discord.
