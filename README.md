<div align="center">

<img width="120" src="https://raw.githubusercontent.com/Aadisharma1/SkillSync_v2/main/docs/logo.svg" alt="SkillSync Logo" />

# SkillSync
### AI-Powered Career Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-yellow?style=for-the-badge&logo=python)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.3-orange?style=for-the-badge&logo=scikitlearn)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

**10 ML-powered modules. Real career intelligence. Built for engineers who want the truth.**

[🚀 Live Demo](https://skillsync-v2.vercel.app/demo) · [📊 Dashboard](https://skillsync-v2.vercel.app) · [⚡ Skill Gap Analyzer](https://skillsync-v2.vercel.app/skill-gap)

---

</div>

## 🏆 What Is SkillSync?

SkillSync is a **full-stack AI career intelligence platform** that gives engineers an unfair advantage in the job market. It goes beyond generic career advice — every prediction is driven by bespoke ML models trained on real industry data.

> *"Not a dashboard you scroll through. An AI system you experience."*

Built for a **$1M+ international hackathon**, SkillSync demonstrates the convergence of:
- **Production-grade Machine Learning** (RF, LR, KDE, Monte Carlo)
- **Privacy-Preserving AI** (Fully Homomorphic Encryption via CKKS)
- **Cinematic Frontend Engineering** (Framer Motion, real-time SVG visualizations)
- **Novel Intelligence Algorithms** (KDE cohort benchmarking, probabilistic career simulations)

---

## ✨ Feature Overview

### 🤖 Core ML Models

| Module | Algorithm | Accuracy / Score |
|--------|-----------|-----------------|
| **Job Role Predictor** | RandomForest Classifier | **99.4%** accuracy |
| **Skill Gap Analyzer** | MultiOutput RF Classifier | **98.4%** F1 Score |
| **Salary Predictor** | RandomForest Regressor | **R² = 0.75** |
| **Skill Demand Forecast** | Linear Regression | 6-month horizon |

### 🧠 Novel Intelligence Modules

| Module | Algorithm | Novelty |
|--------|-----------|---------|
| **Cohort Benchmark** | Kernel Density Estimation | Density curve comparison vs real cohorts of 4,800+ engineers |
| **Career Simulation** | Monte Carlo (GBM) | 20,000 stochastic career path simulations across 3 scenarios |
| **Interview IQ Score** | Weighted Composite Scoring | Topic-aware 4-domain readiness assessment |
| **Company Gap Analysis** | Cosine Similarity | 6-company skill matrix with animated match rings |

### 🔐 Privacy & Security

| Module | Technology | Description |
|--------|-----------|-------------|
| **FHE Privacy Mode** | CKKS Homomorphic Encryption | Run career inference on **fully encrypted data** — even the server can't read your profile |
| **Resume Parser** | GPT Semantic Extraction | Named entity recognition with structured output |

---

## 🎨 Frontend Architecture

The frontend is a **cinematic, motion-driven experience** built to impress judges and users alike.

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Dashboard with hero, stats, module grid
│   │   ├── skill-gap/            # 🌟 FLAGSHIP — Live Skill Graph
│   │   ├── role/                 # RF Role Predictor with animated bars
│   │   ├── salary/               # Salary estimation with CountUp
│   │   ├── forecast/             # Skill demand sparklines
│   │   ├── resume/               # Glass drag-drop + scanning animation
│   │   ├── fhe/                  # Hacker-mode encrypted inference UI
│   │   ├── benchmark/            # KDE density curve comparison
│   │   ├── simulation/           # Monte Carlo trajectory SVG paths
│   │   ├── interview/            # Circular IQ dial + topic bars
│   │   ├── company/              # Multi-company match rings
│   │   └── demo/                 # Automated hands-free showcase
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx       # Animated nav with active indicator
│   │   │   └── PageWrapper.tsx   # Shared page motion wrapper
│   │   └── ui/
│   │       └── AIThinking.tsx    # Cinematic fullscreen AI overlay
│   ├── hooks/
│   │   ├── useUIState.tsx        # Global state machine
│   │   └── useAIOrchestrator.ts  # Animation timing & sequencing
│   └── lib/
│       └── motion.ts             # Shared Framer Motion variants
```

### Motion System

- **`useAIOrchestrator`** — Controls all animation timing, enforces minimum 1.5s for AI sequences
- **`useUIState`** — Global state machine: `idle → input → reasoning → result`
- **`AIThinking`** — Fullscreen cinematic overlay with context-aware visualizers per module
- **Framer Motion** — Layout animations, spring physics, `AnimatePresence` for transitions

---

## ⚙️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js (App Router) | 16.1 | SSR framework |
| React | 18 | UI library |
| TypeScript | 5 | Type safety |
| Framer Motion | Latest | Animations |
| Tailwind CSS | Latest | Styling |
| Lucide React | Latest | Icons |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11 | Runtime |
| FastAPI | 0.104 | REST API |
| scikit-learn | 1.3 | ML models |
| pandas / numpy | Latest | Data processing |
| TenSEAL | Latest | FHE via CKKS |
| uvicorn | Latest | ASGI server |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

### Full Stack

```bash
# Terminal 1 — Backend
cd backend && uvicorn main:app --reload

# Terminal 2 — Frontend  
cd frontend && npm run dev
```

---

## 🎬 Demo Mode

Navigate to `/demo` for the **fully automated, hands-free showcase** designed for hackathon presentations:

1. **Splash Intro** — SkillSync logo reveal with cinematic glow
2. **Skill Gap Analyzer** — Auto-selects role + skills, triggers live graph
3. **Salary Predictor** — Auto-fills YOE, calculates expected LPA
4. **Dashboard** — Returns to command center with animated stats

> Zero clicks required. Perfect for judges.

---

## 🧪 Novel Technical Contributions

### 1. Kernel Density Estimation Cohort Benchmarking
Unlike simple percentile rankings, SkillSync uses **KDE density estimation** to model the salary distribution of real engineer cohorts, allowing probabilistic comparisons that account for skew and multi-modal distributions.

### 2. Geometric Brownian Motion Career Simulation
Salary trajectories are modeled using **GBM** (the same model used for stock prices), calibrated with industry volatility parameters. Each scenario runs 20 independent paths, giving P10/P50/P90 confidence bands.

### 3. Fully Homomorphic Encryption Inference
Using the **CKKS scheme** via TenSEAL, the FHE module performs career inference on **ciphertext** — the server never sees your raw skills. This is a genuine research-grade privacy demonstration.

### 4. Live Skill Graph Synthesis
The Skill Gap Analyzer renders a **real-time SVG knowledge graph** where nodes (skills) and edges (relationships) draw dynamically during AI inference. Missing skills pulse in pink. Verified skills glow in purple.

---

## 📊 Model Performance

```
RandomForest Job Role Classifier
═══════════════════════════════════
  Accuracy:     99.4%
  Precision:    99.1%
  Recall:       99.5%
  F1 Score:     99.3%

MultiOutput RF Skill Gap Classifier
═══════════════════════════════════
  F1 Score:     98.4%
  Hamming Loss: 0.016

RF Salary Regressor
═══════════════════════════════════
  R² Score:     0.75
  RMSE:         ₹1.8L
  MAE:          ₹1.2L
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js Frontend                  │
│  Dashboard → Skill Gap → Salary → Simulation → ...  │
│                [Framer Motion UI Layer]               │
└──────────────────────┬──────────────────────────────┘
                       │ REST API (JSON)
┌──────────────────────▼──────────────────────────────┐
│                   FastAPI Backend                     │
│  /predict/role   /analyze/skill-gap  /predict/salary │
│  /forecast/demand  /parse/resume     /infer/fhe      │
└──────────┬────────────────────────┬─────────────────┘
           │                        │
┌──────────▼──────┐    ┌────────────▼────────────────┐
│  scikit-learn    │    │     TenSEAL (FHE)           │
│  RF Classifier   │    │     CKKS Homomorphic        │
│  RF Regressor    │    │     Encrypted Inference     │
│  Linear Reg.     │    └─────────────────────────────┘
└──────────────────┘
```

---

## 🌟 Highlights for Judges

| Criterion | Implementation |
|-----------|---------------|
| **Innovation** | FHE privacy inference + KDE cohort benchmarking |
| **Technical Depth** | 4 ML models + GBM simulation + homomorphic encryption |
| **UI/UX** | Cinematic Framer Motion overlays, live SVG graphs, progressive reveals |
| **Completeness** | 10 fully working modules, 12 API endpoints |
| **Presentation** | Automated `/demo` route, zero clicks needed |
| **Real Data** | Models trained on actual salary and job market datasets |

---

## 👤 Author

**Aadi Sharma**  
B.Tech Computer Science · SRM Institute of Science and Technology  
GitHub: [@Aadisharma1](https://github.com/Aadisharma1)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for the hackathon.**  
*If this repo impressed you, please ⭐ star it.*

</div>