[FinLearnAI_README.md](https://github.com/user-attachments/files/31868353/FinLearnAI_README.md)
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F2E29,50:1B4B43,100:23695D&height=180&section=header&text=FinanceX%20AI&fontSize=42&fontColor=E8C468&fontAlignY=42&desc=Gamified%2C%20Multilingual%20Stock%20Market%20Education%20Platform&descAlignY=62&descColor=D8E8E3" width="100%"/>

<img src="https://img.shields.io/badge/React-1B4B43?style=for-the-badge&logo=react&logoColor=E8C468" />
<img src="https://img.shields.io/badge/Node.js-1B4B43?style=for-the-badge&logo=nodedotjs&logoColor=E8C468" />
<img src="https://img.shields.io/badge/Postgre_SQL-1B4B43?style=for-the-badge&logo=PostgreSQL&logoColor=E8C468" />
<img src="https://img.shields.io/badge/Gemini_API-1B4B43?style=for-the-badge&logo=googlegemini&logoColor=E8C468" />

</div>

## 📚 Overview

**FinanceX AI** teaches stock market fundamentals through short animated lessons, adaptive quizzes, and an AI learning assistant — available in **Tamil and English** — to lower the barrier to financial literacy for first-time learners.

Built as a Semester 5 mini project, and designed as the foundation for a planned final-year extension into a full AI-powered wealth advisor platform.

## ✨ Key Features

| Feature | Description |
|---|---|
| 🌐 **Bilingual Content** | Every lesson and AI response available in Tamil or English |
| 🎬 **Animated Lessons** | Short, jargon-free lessons illustrated with Lottie animations |
| 🔥 **Streaks & Badges** | Daily quiz with streak tracking and milestone badges |
| 🎯 **Adaptive Difficulty** | Question difficulty adjusts automatically based on recent performance |
| 🤖 **AI Learning Assistant** | Gemini-powered chat for on-demand, tier-appropriate explanations |
| 📈 **Progress Dashboard** | Visual tracking of lessons completed, streaks, and quiz accuracy |
| 🧮 **Goal Simulator** | Compounding/SIP growth calculator with visual projections |

## 🏗️ Tech Stack

- **Frontend:** React, i18next (Tamil/English), Lottie, Framer Motion, Recharts
- **Backend:** Node.js, Express.js
- **Database:** Postgre SQL
- **AI Layer:** Google Gemini API
- **Deployment:** Vercel (frontend), Render (backend)

## 🗂️ Data Model (Core Collections)

```
User          → language, tier, streak, completedLessons, badges, quizHistory
Lesson        → title (EN/TA), animation, explanation (EN/TA), difficultyLevel, quizQuestion
AIQueryCache  → term, language, tier, cached response
```

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/dattatreya-07/FinLearnAI.git
cd FinLearnAI

# Install dependencies
npm install --prefix client
npm install --prefix server

# Add environment variables (.env)
GEMINI_API_KEY=your_key_here
MONGODB_URI=your_connection_string

# Run
npm run dev
```

## 📌 Roadmap

- [ ] Voice narration via Web Speech API
- [ ] Anonymized leaderboard
- [ ] Extension into full AI-powered wealth advisor (final-year project)

---

<div align="center">
<sub>Built by <a href="https://www.linkedin.com/in/dattatreya-mk">Dattatreya M K</a> — Aspiring Fintech Analyst</sub>
</div>
