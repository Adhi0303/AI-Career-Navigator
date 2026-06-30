# MODULES.md
# CareerOS - Modules Roadmap

**Current Project Status:** 
- **Phase 0 (Project Foundation):** ✅ Completed
- **Phase 1-10:** 🚧 Not Started

---

## Phase 0: Project Foundation ✅ Completed

### Sub-module 0.1: Monorepo Setup
- **What to build:** A unified pnpm monorepo workspace containing the frontend, backend, and shared libraries.
- **Logic:** Configure `pnpm-workspace.yaml` and `package.json` files to link packages like `lib/api-zod` and `lib/db` so they can be seamlessly consumed by the React app and Express server.
- **Concepts/Techniques:** Monorepo Architecture, Package Management.

### Sub-module 0.2: Backend API Server
- **What to build:** The core backend application using Express.js.
- **Logic:** Set up a TypeScript-based Express server with CORS, body parsing, and routing. This server will handle all REST API requests from the frontend and interact with the database and AI models.
- **Concepts/Techniques:** Node.js, Express.js, REST API Design.

### Sub-module 0.3: Database & ORM
- **What to build:** PostgreSQL database connection and schema management.
- **Logic:** Define strongly-typed database schemas using Drizzle ORM in the `lib/db` package. Export these schemas to allow the API server to perform CRUD operations on users, resumes, and jobs.
- **Concepts/Techniques:** Relational Databases, ORM (Drizzle), Data Modeling.

### Sub-module 0.4: Frontend Setup
- **What to build:** The user interface for the CareerOS platform.
- **Logic:** Scaffold a React application using Vite and configure Tailwind CSS and shadcn/ui for styling. Set up API client hooks to communicate with the Express backend.
- **Concepts/Techniques:** React, Vite, Component-based UI, Tailwind CSS.

---

## Phase 1: Resume Intelligence 🚧 Not Started

### Sub-module 1.1: Document Parser
- **What to build:** A service to extract raw text from uploaded resumes (PDF/DOCX).
- **Logic:** Create an endpoint that accepts a file upload, utilizes a document parsing library (like PyMuPDF or pdf-parse) to read the document, and sanitizes the extracted raw text for AI processing.
- **Concepts/Techniques:** Document AI, OCR, File Upload Handling.

### Sub-module 1.2: Career Profile Extraction
- **What to build:** An engine that converts unstructured resume text into a structured JSON profile.
- **Logic:** Pass the raw text to an LLM with strict JSON schema constraints (using Zod) to extract Skills, Experience, Projects, and Education accurately.
- **Concepts/Techniques:** Natural Language Processing (NLP), Information Extraction, Structured AI Outputs.

---

## Phase 2: Career Knowledge Engine 🚧 Not Started

### Sub-module 2.1: Knowledge Base Storage
- **What to build:** A structured database to serve as the single source of truth for a user's professional identity.
- **Logic:** Store the extracted JSON career profile into relational PostgreSQL tables (e.g., `skills`, `projects`, `experiences`). This prevents the AI from needing to parse the original resume every time.
- **Concepts/Techniques:** Knowledge Representation, Database Normalization.

### Sub-module 2.2: Career Profile API
- **What to build:** REST endpoints for managing the user's career data.
- **Logic:** Implement Express routes (`GET /profile`, `PUT /profile`) using Drizzle ORM to allow the React frontend to view and edit the extracted career profile.
- **Concepts/Techniques:** API Development.

---

## Phase 3: Job Discovery Engine 🚧 Not Started

### Sub-module 3.1: Job Scraper & Parser
- **What to build:** A pipeline to collect job descriptions and extract key requirements.
- **Logic:** Scrape job postings from URLs, then use an LLM to extract Company, Role, Salary, Location, and required Skills into a structured format.
- **Concepts/Techniques:** Web Scraping, Data Pipelines, LLM Parsing.

### Sub-module 3.2: Job Deduplication & Storage
- **What to build:** A clean, deduplicated database of job postings.
- **Logic:** Hash the job descriptions or URLs to identify and remove duplicates before saving the structured job data into PostgreSQL.
- **Concepts/Techniques:** Data Cleaning, Data Engineering.

---

## Phase 4: Job Intelligence Engine 🚧 Not Started

### Sub-module 4.1: Vector Embeddings
- **What to build:** A vector database for semantic matching.
- **Logic:** Generate vector embeddings for Job Descriptions and the user's Projects/Experience using an embedding model (e.g., Sentence Transformers). Store these in ChromaDB.
- **Concepts/Techniques:** Vector Databases, Text Embeddings.

### Sub-module 4.2: Semantic Job Matcher
- **What to build:** A ranking system to find the best job opportunities.
- **Logic:** Calculate the cosine similarity between the Job Description embedding and the user's Career Profile embedding. Rank jobs based on semantic fit and hard preferences (e.g., salary, location).
- **Concepts/Techniques:** Recommendation Systems, Cosine Similarity, Semantic Search.

---

## Phase 5: Resume Tailoring Agent 🚧 Not Started

### Sub-module 5.1: Context Retriever
- **What to build:** A service that fetches the most relevant experiences for a specific job.
- **Logic:** Query ChromaDB using the target Job Description to retrieve the user's past projects and skills that have the highest semantic relevance to the job requirements.
- **Concepts/Techniques:** Retrieval-Augmented Generation (RAG), Semantic Retrieval.

### Sub-module 5.2: Resume Generator
- **What to build:** An AI agent that customizes the resume without fabricating information.
- **Logic:** Construct a strict prompt that includes the Job Description, the retrieved relevant projects, and the base Career Profile. Instruct the LLM to reorder sections and optimize bullet points to match the job, enforced by AI guardrails.
- **Concepts/Techniques:** Prompt Engineering, Context Engineering, AI Guardrails.

---

## Phase 6: ATS Intelligence Engine 🚧 Not Started

### Sub-module 6.1: ATS Scorer
- **What to build:** A deterministic scoring engine to evaluate resume ATS compatibility.
- **Logic:** Perform a keyword and skill comparison between the tailored resume and the job description. Calculate a mathematical score based on matches, formatting, and role alignment (avoiding LLM math hallucinations).
- **Concepts/Techniques:** Rule-based Systems, Explainable AI.

### Sub-module 6.2: Improvement Recommender
- **What to build:** Human-readable feedback generation.
- **Logic:** Pass the calculated ATS score breakdown to an LLM to generate clear suggestions for the user (e.g., "Add 'Docker' to your skills section").
- **Concepts/Techniques:** LLM Reasoning.

---

## Phase 7: Resume Version Manager 🚧 Not Started

### Sub-module 7.1: Version Storage
- **What to build:** A system to save and track every generated resume.
- **Logic:** Save the customized resume file locally (or via S3) and log the metadata (ATS Score, Date, Target Job, File Path) in PostgreSQL for full traceability.
- **Concepts/Techniques:** File Management, Version Control.

---

## Phase 8: Career Dashboard 🚧 Not Started

### Sub-module 8.1: Application Tracker
- **What to build:** A kanban-style UI to track job applications.
- **Logic:** Create React components to display jobs in columns (Saved, Applied, Interview, Rejected, Offer). Fetch and update statuses via the Express API.
- **Concepts/Techniques:** React Dashboards, State Management, Data Visualization.

---

## Phase 9: Career Coach Agent 🚧 Not Started

### Sub-module 9.1: Insights & Recommendations
- **What to build:** A proactive AI career assistant.
- **Logic:** Analyze the user's application history and missed ATS keywords across all saved jobs to generate personalized learning roadmaps and career insights.
- **Concepts/Techniques:** Agentic AI, Personalized Recommendations, Data Analytics.

---

## Phase 10: Production Deployment 🚧 Not Started

### Sub-module 10.1: Containerization & CI/CD
- **What to build:** Production-ready deployment setup.
- **Logic:** Write Dockerfiles for the Express backend and Vite frontend. Set up GitHub Actions for automated testing and building before deploying to platforms like Vercel or Railway.
- **Concepts/Techniques:** Docker, CI/CD, DevOps.
