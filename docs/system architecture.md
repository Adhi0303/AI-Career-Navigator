# SYSTEM_ARCHITECTURE.md

# CareerOS

### AI-Powered Career Intelligence Platform

> **Version:** 1.0
> **Project Type:** AI Engineering Flagship Project
> **Architecture:** Single User • Local First • Modular AI System

---

# Vision

CareerOS is not a resume builder.

It is a **Career Intelligence Platform** that understands a user's professional identity, continuously monitors relevant job opportunities, intelligently tailors resumes for each opportunity, evaluates ATS compatibility, and manages the entire application workflow.

Unlike existing resume optimization tools, CareerOS separates reasoning, retrieval, optimization, and evaluation into modular AI services.

The objective is not to automate applications blindly.

The objective is to build an explainable AI system that assists users in making better career decisions.

---

# Core Philosophy

Instead of:

```
Resume
↓

GPT

↓

Optimized Resume
```

CareerOS performs:

```
Career Understanding

↓

Job Understanding

↓

Semantic Matching

↓

Resume Reasoning

↓

ATS Validation

↓

Version Management

↓

Application Tracking
```

Every stage has a dedicated responsibility.

---

# System Overview

```
                     CareerOS

 ┌──────────────────────────────────────────┐
 │              React Frontend              │
 └──────────────────────────────────────────┘
                    │
                    │ REST API
                    ▼
 ┌──────────────────────────────────────────┐
 │             FastAPI Backend              │
 └──────────────────────────────────────────┘
                    │
      ┌─────────────┼─────────────┐
      │             │             │
      ▼             ▼             ▼

 Career DB      Vector DB      File Storage

(PostgreSQL)    (ChromaDB)     (PDF/DOCX)

      │
      ▼

 AI Intelligence Layer

      │
 ┌────┼────────────────────────────────────┐
 │    │    │    │    │    │    │
 ▼    ▼    ▼    ▼    ▼    ▼    ▼

Resume Parser

Career Knowledge Engine

Job Discovery Engine

Job Intelligence Engine

Resume Tailoring Agent

ATS Intelligence Engine

Career Coach
```

---

# High-Level Workflow

```
Upload Resume

↓

Resume Parsing

↓

Career Profile Creation

↓

Store Structured Career Data

↓

Collect Jobs

↓

Rank Jobs

↓

Select Resume Template

↓

Tailor Resume

↓

ATS Analysis

↓

Generate Resume

↓

Save Resume Version

↓

Track Application
```

---

# AI Architecture

CareerOS consists of independent AI modules.

Each module has one responsibility.

No module should perform multiple unrelated tasks.

---

# Module 1

Career Profile Engine

Purpose

Understand the user.

Input

```
Resume.pdf
```

Output

```
Structured Career Profile
```

Responsibilities

* Resume Parsing
* Skill Extraction
* Project Extraction
* Experience Extraction
* Education Extraction
* Certifications
* Resume Classification

AI Concepts

* NLP
* Document AI
* Information Extraction
* Structured Outputs

Database

PostgreSQL

---

# Module 2

Career Knowledge Base

Purpose

Become the single source of truth.

Stores

* Skills
* Projects
* Experience
* Certifications
* Resume Templates

Every AI module reads from here.

Nothing should read directly from uploaded resumes.

---

# Module 3

Job Discovery Engine

Purpose

Continuously collect relevant jobs.

Sources

* Naukri
* Wellfound
* LinkedIn (if supported)
* Company Career Pages

Responsibilities

* Scraping
* Parsing
* Cleaning
* Duplicate Removal

Output

Job Database

---

# Module 4

Job Intelligence Engine

Purpose

Find the best opportunities.

Input

```
All Jobs
```

Output

```
Top Ranked Jobs
```

Ranking Factors

* Preferred Role
* Salary
* Location
* Remote
* Experience
* Skills
* Company Type

AI Concepts

* Ranking
* Recommendation Systems
* Embeddings
* Semantic Similarity

---

# Module 5

Resume Tailoring Agent

Purpose

Customize resumes without inventing experience.

Input

Career Profile

*

Resume Template

*

Job Description

Output

Tailored Resume

Rules

✔ Reorder sections

✔ Rewrite bullet points

✔ Improve keywords

✔ Highlight relevant projects

✘ Never fabricate experience

✘ Never invent skills

AI Concepts

* Prompt Engineering
* Context Engineering
* Tool Calling
* Structured Generation

---

# Module 6

ATS Intelligence Engine

Purpose

Evaluate resume quality.

Instead of asking an LLM to score resumes,

CareerOS computes its own score.

Evaluation

Keyword Match

Skill Match

Project Relevance

Experience Match

Formatting

Role Alignment

Overall Score

Example

```
ATS Score

91/100
```

LLM Responsibility

Explain improvements.

Not calculate score.

---

# Module 7

Resume Version Manager

Purpose

Maintain every generated resume.

Stores

Resume Version

↓

Job

↓

Date

↓

ATS Score

↓

Company

↓

Resume Template

This creates complete traceability.

---

# Module 8

Application Dashboard

Purpose

Track applications.

Status

* Saved
* Applied
* OA
* Interview
* Offer
* Rejected

Stores

Company

Job Link

Resume Version

Applied Date

Notes

---

# Module 9

Career Coach

Purpose

Provide proactive recommendations.

Examples

```
Your AI Resume

performed well
for Computer Vision jobs.

Consider applying to more CV roles.
```

or

```
You consistently miss Docker.

Recommended Learning

Docker + Kubernetes
```

This module transforms CareerOS into a true career assistant.

---

# Data Storage Strategy

PostgreSQL

Used For

* Career Profile
* Projects
* Skills
* Jobs
* Applications
* Resume Metadata

Reason

Highly structured information.

No semantic retrieval required.

---

# ChromaDB

Used For

Semantic Search

Stores

* Resume Chunks
* Job Description Chunks
* Project Descriptions

Purpose

Retrieve relevant context during resume tailoring.

Example

Job asks for

```
Computer Vision
```

Retrieve

```
Neural Mosaic Reconstruction
```

instead of

```
NotebookLM
```

---

# File Storage

Stores

Original Resumes

Generated Resumes

Job Descriptions

Cover Letters

All files remain versioned.

---

# Data Flow

## Resume Upload Flow

```
User

↓

Upload Resume

↓

PDF Parser

↓

Information Extractor

↓

Career Profile

↓

PostgreSQL
```

---

## Job Discovery Flow

```
Scraper

↓

Job Parser

↓

Clean Data

↓

PostgreSQL
```

---

## Resume Optimization Flow

```
Selected Job

↓

Retrieve Career Profile

↓

Retrieve Relevant Projects

↓

Resume Tailoring Agent

↓

Tailored Resume

↓

ATS Engine

↓

Suggestions

↓

Final Resume

↓

Store Version
```

---

## Application Flow

```
Generated Resume

↓

Save

↓

Application Dashboard

↓

Manual Apply

↓

Status Updates
```

---

# Why Use PostgreSQL + ChromaDB?

Because they solve different problems.

PostgreSQL

Stores facts.

Example

```
Skill

Python

Years

2
```

ChromaDB

Stores meaning.

Example

```
This project demonstrates
deep learning and computer vision.
```

The AI retrieves semantically similar content.

Not exact matches.

---

# AI Request Flow

```
User selects Job

↓

Backend

↓

Retrieve Career Profile

↓

Retrieve Relevant Projects

↓

Retrieve Similar Resume Sections

↓

Construct Context

↓

Send to LLM

↓

Receive Structured Resume

↓

Run ATS Engine

↓

Generate Suggestions

↓

Return Final Resume
```

---

# Design Principles

CareerOS follows six engineering principles.

1.

Single Source of Truth

Career Profile is the only permanent memory.

---

2.

Explainable AI

Every optimization must explain why it happened.

---

3.

No Hallucinations

Never invent skills.

Never invent experience.

---

4.

Human Approval

The user always reviews before applying.

---

5.

Modular Architecture

Every AI module can be independently upgraded.

---

6.

Production Ready

Every service communicates through APIs.

No tightly coupled modules.

---

# Technologies

Frontend

* React
* TypeScript
* TailwindCSS
* shadcn/ui

Backend

* FastAPI

AI

* Ollama
* Groq API
* DeepSeek
* Qwen
* Llama

NLP

* spaCy
* Sentence Transformers

Database

* PostgreSQL

Vector Database

* ChromaDB

Storage

* Local Storage
* Future: S3 Compatible Storage

Deployment

* Docker
* GitHub Actions
* Vercel
* Railway

---

# Future Roadmap (Version 2)

* Multi-user authentication
* LinkedIn profile import
* GitHub repository analysis
* Portfolio analysis
* Interview preparation agent
* Company research agent
* Salary negotiation assistant
* Learning roadmap generator
* Email integration
* Calendar integration
* Browser automation (optional)
* Voice-based career assistant

---

# Final Architecture Philosophy

CareerOS is designed as an AI Operating System for career management rather than a resume optimization tool.

Every AI component has a clearly defined responsibility, every decision is explainable, and every generated resume is grounded in the user's verified experience.

The system emphasizes intelligent reasoning, semantic retrieval, and modular AI engineering over simple prompt-based text generation.
