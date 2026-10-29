<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:042F2E,50:064E3B,100:047857&height=200&section=header&text=FinanceX&fontSize=46&fontColor=F59E0B&fontAlignY=42&desc=Institutional%20Financial%20Terminal%20%7C%20NISM%20Certification%20LMS%20%7C%20AI%20Tutor&descAlignY=64&descColor=D1FAE5" width="100%"/>

[![React](https://img.shields.io/badge/React-19.0-047857?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-064E3B?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-047857?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-064E3B?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Tutor-047857?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable_Offline-F59E0B?style=for-the-badge&logo=pwa&logoColor=black)](https://web.dev/progressive-web-apps/)

</div>

---

## 🏛️ Executive Summary

**FinanceX** is an institutional-grade, gamified financial education platform, quantitative simulation terminal, and AI-powered certification learning system designed for the Indian Capital Markets. It provides end-to-end preparation for **SEBI / NISM Certifications** (specifically **NISM-Series-XV: Research Analyst Examination**, **Series VIII: Equity Derivatives**, and **Series V-A: Mutual Funds**), backed by a simulated ₹10,00,000 INR paper trading sandbox and real-time AI tutor.

> 📖 **Comprehensive System Documentation:**  
> For the complete architectural specification, database schemas, tech stack rationale, mathematical LaTeX implementation, and function-level breakdowns, please read [**`FINANCEX_MASTER_SPECIFICATION.md`**](./FINANCEX_MASTER_SPECIFICATION.md).

---

## ✨ Core Platform Capabilities

| Module | Features & Capabilities |
| :--- | :--- |
| 📚 **Interactive NISM Terminal** | Full 15-chapter NISM Series XV curriculum with dual-mode (KaTeX Interactive Text & HD 1080p Video Lectures), regulatory case studies, and official February 2026 workbook download. |
| 📈 **Simulated Paper Trading** | ₹10,00,000 INR sandbox with live market, limit, and stop-loss orders, real-time P&L tracking, portfolio ledger, and one-click square-off. |
| 🤖 **AI Financial Educational Tutor** | Context-aware Google Gemini assistant with voice speech synthesis (Play/Pause/Rate control), formula cheatsheet generation, and English + Tamil support. |
| 🔄 **Spaced Repetition & Learning Loop** | SuperMemo-inspired forgetting curve algorithm, deterministic 0–100% concept mastery tracking, and gamified goal roadmap progression. |
| ⏱️ **Evaluation & Mock Exams** | Chapter checkpoint quizzes and 100-mark full NISM mock exams with SEBI negative marking (-0.25) and anti-cheat tab-switch detection. |
| 💬 **Learner Community Forum** | Persistent peer doubt-clearing forum with real author attribution, profile cards, cross-platform reflection on Dashboard, and ⌘K search. |
| 📱 **Progressive Web App (PWA)** | Installable on Windows, macOS, Android, and iOS with standalone display, Service Worker offline caching, and responsive touch layout. |
| 🛡️ **Institutional Admin Portal** | Role-based LMS/CMS management portal for student tracking, course editing, and question bank administration. |

---

## 🏗️ Technology Architecture

- **Frontend Core:** React 19 (`19.0.1`), TypeScript (`5.8.2`), Vite (`6.2.3`)
- **Design System:** Tailwind CSS v4, Custom Emerald Jade (`#047857`) & Wealth Gold (`#F59E0B`) tokens, Glassmorphism, Motion (`12.23.24`)
- **Mathematical Typography:** KaTeX (`^0.16.21`) rendering inline and display LaTeX equations
- **Backend & Persistence:** Supabase (PostgreSQL 15, RLS, Google OAuth2) with resilient client-side offline fallback
- **Artificial Intelligence:** Google Gemini AI SDK (`@google/genai`)
- **Speech Synthesis:** Web Speech API (`speechService`) with variable playback rates (0.8x, 1.0x, 1.25x)
- **Visualizations:** Recharts (`^3.10.1`), Canvas Confetti (`^1.9.4`)
- **Internationalization:** i18next (`^26.4.2`) for bilingual English / Tamil execution

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18.0.0 or higher
- NPM v9.0.0 or higher

### Installation
```bash
# Clone repository
git clone https://github.com/dattatreya-07/FinanceX.git
cd FinanceX

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Validate TypeScript and compile production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License & Attribution

Designed and engineered for Indian Capital Markets education and SEBI certification mastery. Developed by [Dattatreya](https://github.com/dattatreya-07).
