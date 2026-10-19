# PHASE 25: FINANCEX ADMIN PORTAL & CONTENT MANAGEMENT SYSTEM (LMS/CMS)

## 1. Executive Summary & Architecture Overview

FinanceX Admin Portal & Content Management System provides an enterprise-grade, server-backed educational management layer for capital markets education, quantitative modeling, and regulatory certifications (NISM, NCFM, SEBI, CFA Institute).

### System Topology

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                               FinanceX Admin & CMS Ecosystem                                │
├──────────────────────────────────────────────┬──────────────────────────────────────────────┤
│               Admin Portal UI Layer          │            Authoritative Server Layer        │
├──────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ • KPI Dashboard with Real DB Metrics         │ • PostgreSQL & Supabase Database Tables      │
│ • Visual Course Structure Tree Builder       │   - `profiles.role` ('ADMIN' | 'USER' ...)   │
│ • Rich Markdown & KaTeX LaTeX Formula Editor │   - `content_audit_logs` (WHO, WHAT, WHEN)   │
│ • Regulatory Question Bank & Bulk Importer   │   - `courses`, `lessons`, `quizzes`, `exams` │
│ • Quizzes & Mock Exams Configurator          │ • Row Level Security (RLS) Policies          │
│ • Bilingual (English & Tamil) Pipeline       │ • Supabase Storage Bucket `educational-assets│
│ • Study Plan Templates & Announcements       │ • AI Tutor RAG Real-Time Knowledge Sync      │
│ • Learner Directory & Certificate Inspection │ • Non-destructive Audit Ledger Persistence   │
└──────────────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 2. Server-Backed Authorization & Security Model

1. **Role Verification Hierarchy**:
   - `SUPER_ADMIN`: Unrestricted platform governance and permission delegation.
   - `ADMIN`: Full CRUD on educational catalogs, question banks, certifications, and asset storage.
   - `CONTENT_ADMIN` / `INSTRUCTOR`: Creation and editing of course modules and practice quizzes.
   - `USER`: Read-only access to published courses, self progress, portfolio simulation, and certificate generation.
2. **Database-Level Row Level Security (RLS)**:
   - `SELECT` policies permit public / authenticated learner discovery of `PUBLISHED` courses, lessons, questions, and mock exams.
   - `INSERT`, `UPDATE`, `DELETE` operations require `public.is_admin(auth.uid())` evaluated server-side in PostgreSQL.
   - No frontend-only flags or `localStorage` privilege overrides are trusted by backend RPCs.

---

## 3. Storage & Educational Assets Architecture

- **Supabase Storage Bucket**: `educational-assets`
  - `/courses/`: Course thumbnail banners and promotional assets.
  - `/lessons/`: Lesson PDFs, downloadable cheatsheets, Excel models.
  - `/resources/`: Statutory circulars (SEBI, NSE, RBI).
  - `/avatars/`: User profile pictures.
- **Supabase Storage Bucket**: `user-certificates`
  - `/user_{id}/`: Learner external attested certificates (PDFs / Images).
- **Client Validation**:
  - Educational assets: max 50MB, MIME validation (`application/pdf`, `image/*`, `.xlsx`).
  - User certificates: max 25MB.

---

## 4. Educational Content Model & Publishing Lifecycle

```
[DRAFT] ───(Curriculum Lead Review)───► [REVIEW] ───(Completeness Check)───► [PUBLISHED] ───(Deprecation)───► [ARCHIVED]
```

### Completeness Gates:
- A course cannot be published without at least 1 module and 1 lesson.
- A quiz cannot be published without at least 1 validated question.
- A mock exam requires total marks, duration, and passing threshold specifications.

---

## 5. Bilingual Content (English & Tamil) Pipeline

- Single core curriculum identity with language variant branches (`en` / `ta`).
- Missing translation indicators alert administrators without duplicating course entities.
- Graceful English fallback ensures learners always receive complete instructional material if localized Tamil text is in draft.
- Formulas ($$\Delta = \frac{\partial V}{\partial S}$$) and financial terms remain standard across both language outputs.

---

## 6. AI-Assisted Content Workflow (Safety Guardrail)

- Admin-triggered AI tools generate:
  - Structured lesson outlines with learning objectives.
  - 5-question NISM assessment sets with detailed rationalizations.
  - Tamil translation drafts of complex derivative concepts.
  - Key takeaway bullet summaries.
- **Critical Policy**: All AI-synthesized educational items are **strictly stored in `DRAFT` status** and require human faculty approval before publication.

---

## 7. Auditability Ledger (`public.content_audit_logs`)

Every administrative mutation records:
- `WHO`: Admin ID and verified email.
- `WHAT`: Action (`CREATE`, `UPDATE`, `DELETE`, `PUBLISH`, `UNPUBLISH`, `ARCHIVE`, `UPLOAD`, `IMPORT`).
- `WHEN`: ISO-8601 UTC timestamp.
- `ENTITY`: Target entity type (`COURSE`, `LESSON`, `QUESTION`, `QUIZ`, `MOCK_EXAM`, `RESOURCE`) and identifier.
- `DETAILS`: Snapshot of mutated parameters.

---

## 8. Verified Learner Profiling & Certificate Uploads

- Learners can edit their professional profile (headline, bio, institution/college, phone number, avatar).
- Learners can upload external credentials (NISM Series VIII/XV, NPTEL, SEBI, CFA, Unstop) with document attachment, credential verification link, and self-attestation badges.
