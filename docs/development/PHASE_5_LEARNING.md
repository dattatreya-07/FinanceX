# Phase 5 — Learning System

**Project**: FinanceX
**Status**: `COMPLETE`
**Date**: September 6, 2026

---

## 1. Objective
Connect educational curriculum entities (`topics`, `courses`, `lessons`, `lesson_content`, `lesson_resources`, `user_lesson_progress`) to Supabase via `courseService.ts`.

## 2. Implementation Summary
- **Courses & Topics**:
  - `courseService.getCourses()` retrieves active courses.
  - `courseService.getTopics()` retrieves topic taxonomies.
- **Lessons & Content**:
  - `courseService.getLessons(courseId)` retrieves ordered lesson sequences with estimated duration.
  - `courseService.getLessonContent(lessonId)` retrieves structured content blocks, formulas, and takeaways.
  - `courseService.getLessonResources(lessonId)` retrieves downloadable study materials, Excel models, and circulars.
- **User Progress**:
  - `courseService.recordLessonProgress(userId, lessonId, progressPercent, isCompleted)` updates `public.user_lesson_progress`.
  - Progress is strictly bound per user (`UNIQUE(user_id, lesson_id)`), ensuring completion status is never treated as a global lesson property.

## 3. Verification & Gate Check
- [x] Curriculum tables queried through `courseService.ts`
- [x] User-specific lesson progress recorded
- [x] Zero breaking UI changes in `CourseCatalogView` and `LessonView`
- [x] Phase 5 Gate passed
