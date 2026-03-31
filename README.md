# 🚀 ResAnalyse (Resume Intelligence Platform)
![License](https://img.shields.io/badge/license-MIT-blue)

<img width="1920" height="941" alt="Screenshot 2026-03-31 182402" src="https://github.com/user-attachments/assets/92d953ce-e252-4393-88f4-fedc63191fa9" />



## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Backend Endpoints](#backend-endpoints)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)

## Overview
**ResAnalyse** is a full-stack, AI-powered career tool that bridges the gap between job seekers and Applicant Tracking Systems (ATS). It parses resumes, analyzes them against job descriptions using high-performance Llama models, and generates optimized, tailored resumes as downloadable PDFs.

## Key Features
*   **Intelligent PDF Parsing:** Automatically extracts raw text from uploaded resumes using `pdf-parse`.
*   **Structured AI Analysis:** Returns a detailed report including a realistic **ATS Match Score**, **Skill Gap breakdown**, and targeted **Interview Preparation Questions** (Technical & Behavioural).
*   **Dual-Step AI Pipeline:** 
    1.  **Analysis Engine:** Uses Groq-powered Llama models for high-speed report generation validated via Zod.
    2.  **Generation Engine:** A dedicated LLM call produces semantically rich HTML tailored to the job description.
*   **Dynamic PDF Generation:** Uses **Puppeteer** to convert AI-generated HTML templates into professional, ATS-friendly PDF files.
*   **Smart Caching:** Both structured reports and final PDF binary buffers are cached in MongoDB to ensure lightning-fast retrieval and cost-efficiency.
*   **Global Security:** Protects user data with Bcrypt hashing and JWT authorization, managed via React Context API on the frontend.

## Tech Stack
- **Frontend:** React, React Router, Context API (Auth Management), Vanilla CSS.
- **Backend:** Node.js, Express.js.
- **AI Inference:** Groq SDK (Llama), Puppeteer (PDF Rendering).
- **Database:** MongoDB (Mongoose) for persistence and binary caching.
- **Validation & Security:** Zod (Schema Validation), Bcrypt (Password Hashing), JWT (Stateless Authorization).
- **File Handling:** Multer (Memory Storage) & pdf-parse.

## Backend Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register a new user (Zod validated). |
| `POST` | `/login` | Authenticate user and return JWT. |

### 📄 Resume Intelligence (`/api/resume`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/generateReport` | Uploads PDF + Job Description to generate a full analysis. |
| `GET` | `/getReportById/:id` | Fetches a specific analysis report by ID. |
| `GET` | `/allReports` | Retrieves all analysis history for the logged-in user. |
| `GET` | `/resumeGenerator/:id` | Generates and returns the tailored PDF file. |

## Project Structure
```text
resumeAnalyser/
├── backend/
│   ├── controller/      # Auth & Resume logic
│   ├── llm/             # Groq & Puppeteer pipeline
│   ├── middlewares/      # Auth & File parsing
│   ├── routes/          # API Route definitions
│   ├── schemas/         # Mongoose User & Resume models
│   └── index.js         # Server entry point
└── frontend/
    └── src/
        ├── components/  # Nav, Loader, Background
        ├── context/     # AuthContext API
        ├── pages/       # Dashboard, Analyse, Report, Auth
        └── utils/       # API configuration (Axios)
```

## Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/[username]/resumeAnalyser.git
# Create a .env in /backend with:
# MONGO_URI, JWT_SECRET, GROQ_API_KEY

```

2. **Install dependencies**
```bash
cd backend
npm install
cd ../frontend/resume frontend
npm install
```

3. **Start the application**
```bash
cd backend
npm run start
cd ../frontend/resume frontend
npm run dev
```

## Contributing
Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

Please open an issue first for major changes to discuss what you'd like to change.
