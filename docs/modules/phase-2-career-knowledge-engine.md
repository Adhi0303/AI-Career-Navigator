# Phase 2: Career Knowledge Engine

## Overview
Phase 2 transitions the application from stateless data processing into a persistent, intelligent Career Knowledge Engine. By utilizing a normalized relational database (PostgreSQL via Neon) and Drizzle ORM, the extracted resume data becomes queryable and structured for future AI integrations.

## Architecture & Components

### 1. Relational Database Schema (`@workspace/db`)
A fully normalized schema was implemented using Drizzle ORM to ensure the AI can query specific, structured slices of a user's career identity:
- **`profiles`**: Root identity information, including name, dynamic location, email, and arrays for web links and languages.
- **`skills`**: A flat relational list of technologies and proficiencies.
- **`experience`**: Professional history, complete with highly detailed arrays of bullet points extracted directly from the resume.
- **`projects`**: Portfolio highlights, powered by a strict AI extraction rule that demands comprehensive, multi-sentence descriptions outlining the purpose, mechanics, and value-proposition of each project.
- **`education` & `certifications`**: Academic and professional credential tracking.

### 2. Intelligent Data Ingestion (`api-server`)
The `/api/resume/parse` Express endpoint was upgraded to handle direct database upserts.
- **AI Extraction Pipeline**: Upon PDF upload, the raw text is fed to Groq AI with a refined System Prompt. The prompt now strictly enforces the extraction of detailed project descriptions and dynamic locations.
- **Atomic Updates**: The backend checks for an existing user profile (currently hardcoded for a single-user system). It updates the root profile while completely replacing the relational entities (`skills`, `experience`, `projects`, etc.) to ensure the database always perfectly mirrors the latest uploaded resume.

### 3. Career Profile API
Two dedicated REST endpoints were established:
- **`GET /api/profile`**: Aggregates the root profile and all relational entities into a cohesive JSON structure matching the frontend's expectations.
- **`PUT /api/profile`**: Validates structural updates via the `CareerProfileSchema` (Zod) and applies them to the database, allowing for manual edits to the AI-extracted data.

### 4. Frontend Integration (`careerpilot`)
The React frontend completely abandoned mock data in favor of live API integration.
- **State Management**: Integrated `@tanstack/react-query` to handle data fetching, caching, and background refetching across the application.
- **Dynamic UI Mapping**: The `Profile` component was rebuilt to elegantly display the live data, including conditional rendering for dynamic links (GitHub, LinkedIn) and formatting arrays of experience descriptions into clean bulleted lists.

## Outcome
The application now boasts a robust, persistent data layer. The AI parses complex unstructured documents into a highly structured PostgreSQL database, and the frontend beautifully renders this data in real-time. This foundational engine paves the way for Phase 3, where the AI will actively query this database to write highly contextual cover letters and analyze job matches.
