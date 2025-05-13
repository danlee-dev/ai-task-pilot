# AI TaskPilot - AI Task Orchestration Platform

**AI TaskPilot** is an AI-powered platform that automatically analyzes user task descriptions in natural language, recommends the best combination of AI tools, and orchestrates them to deliver results. It integrates LangGraph-based workflows, RAG systems, and multiple AI APIs for intelligent task automation.

![AI TaskPilot Homepage](./images/screenshots/home_page.png)

---

## Feature Demonstrations

### Mathematical Expression Rendering
AI TaskPilot renders LaTeX equations instantly and displays complex mathematical expressions accurately.
![Math Rendering Example](./images/screenshots/example-latex-lendering.png)

### Code Highlighting
Syntax highlighting support for various programming languages.
![Code Rendering Example](./images/screenshots/example-code-lendering.png)

### AI Model Switching
Seamlessly switch between different AI models.
![Model Switching Example](./images/screenshots/example-model-switch.png)

---

## Project Structure

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
│   │   │   ├── chat/    # Chat components with markdown & math rendering
│   │   │   ├── layout/  # Responsive layout components
│   │   │   └── icons/   # UI icons and visual elements
│   │   ├── contexts/    # React contexts for state management
│   │   ├── hooks/       # Custom hooks
│   │   └── utils/       # API calls, formatting, helpers
│   ├── public/          # Static files
│   └── ...
│
├── .env                 # Environment variables
└── README.md
```

---

## Key Features

- **Natural Language Task Processing**: Analyze and understand complex tasks described in natural language
- **AI Tool Orchestration**: Automatically select and chain appropriate AI tools based on task requirements
- **Interactive Chat Interface**: Engage with the AI system through a user-friendly chat interface
- **Math Expression Rendering**: Display LaTeX mathematical formulas with immediate rendering
- **Code Block Highlighting**: Syntax highlighting for multiple programming languages
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Context-Aware AI**: Remember previous conversations and maintain context through sessions

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
- CSS Modules for styling
- KaTeX for math expressions
- React Syntax Highlighter for code blocks
- Context API for state management
- WebSocket for real-time updates

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

Visit `http://localhost:3000` to view the application.

---

## UI Components

### Chat Interface

- **Markdown Rendering**: Rich text formatting with Markdown support
- **Math Expressions**: LaTeX formula rendering with KaTeX
- **Code Blocks**: Syntax highlighting with React Syntax Highlighter
- **Typing Effect**: Natural typing animation for AI responses

### Layout System

- **Responsive Sidebar**: Adaptive sidebar that adjusts to different screen sizes
- **Smart Toggle**: Context-aware toggle button that prevents event bubbling
- **User Account Section**: User profile and settings integrated into sidebar
- **Backdrop System**: Smart backdrop for mobile views that properly handles touch events

---

## Development Progress

- [x] Project structure initialized
- [x] Frontend UI/UX implementation
- [x] Responsive design system
- [x] Chat interface with markdown support
- [x] Math expressions rendering (LaTeX)
- [x] Code syntax highlighting
- [x] Adaptive sidebar with improved UX
- [ ] Intent classifier (GPT-based)
- [ ] RAG document retriever & generator
- [ ] LangGraph-based pipeline system
- [ ] Full backend API implementation

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
- Ensure responsive design works on all target devices
- Maintain accessibility standards

---

## Team

| Role      | Name | Responsibilities                        |
| --------- | ---- | --------------------------------------- |
| Team Lead | Daniel Lee  | Architecture, AI pipeline, tech design  |
| Member  | Michael H. Kim  | Backend API, DB schema, data pipelines  |
| Member  | M.J. Park  | Frontend UI/UX, workflow visualizations |

---

## Contact

For questions or support, please reach out via GitHub Issues or the team Discord.
