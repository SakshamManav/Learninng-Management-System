# eduKnow

Full-stack Learning Management System where instructors build video-based courses and students browse, enroll, and stream content securely.

---

## What it does

eduKnow gives instructors a full course-authoring flow — create a course, organize it into sections and lectures, upload thumbnails and video, and publish it — while students browse the catalog, enroll, and stream lecture videos from a personal dashboard. The core problem the platform solves isn't just CRUD over courses: it's making sure video content is only ever watchable by someone who's actually enrolled, without exposing raw file URLs.

---

## Technical highlights

**Signed URL video delivery** — Course videos live in Supabase Storage as private objects, not public files. Instead of serving a direct link, the backend generates a short-lived Signed URL on request, checks enrollment first, and hands the student a URL that expires. This means video access is enforced server-side per-request rather than relying on an obscure-but-guessable public link.

**Auth0 + JWT authorization layer** — Authentication is delegated to Auth0 (login/registration, session handling), while JWTs carry role and identity into the backend, where role-based middleware gates routes — an instructor can create/edit courses, a student can enroll/view, and API routes are protected accordingly rather than trusting the frontend to hide UI elements.

**Enrollment-gated content access** — Enrollment isn't just a UI flag; it's the actual authorization check between "a course exists" and "you can stream its videos." A user browsing the catalog and a user watching a lecture hit different authorization boundaries even for the same course.

**Structured course hierarchy** — Courses are modeled as Course → Sections → Lectures, each level with its own metadata, which supports partial course editing (add one lecture without touching the rest) and lets the frontend render a normal course-outline UI directly off the data shape.

---

## Architecture

```
        ┌──────────────┐
        │   Student /   │
        │  Instructor   │
        │  (Next.js UI) │
        └──────┬────────┘
               │ HTTPS + JWT
        ┌──────▼────────┐
        │  Node.js /    │
        │  Express API  │
        └──────┬────────┘
       ┌────────┼─────────┐
       │        │          │
┌──────▼────┐ ┌─▼──────┐ ┌─▼─────────────┐
│  MySQL    │ │ Auth0  │ │  Supabase      │
│  courses, │ │ auth   │ │  Storage       │
│  users,   │ │        │ │  (thumbnails,  │
│  enroll-  │ │        │ │   videos +     │
│  ments    │ │        │ │  Signed URLs)  │
└───────────┘ └────────┘ └────────────────┘
```

**Video access flow:**

1. Student requests a lecture video
2. Backend verifies the JWT and checks the enrollment record for that course
3. If enrolled, backend requests a time-limited Signed URL from Supabase Storage
4. Signed URL is returned to the client and used to stream the video directly
5. URL expires — repeat requests re-run the enrollment check

---

## User roles

**Student**
- Browse all available courses
- View detailed course information
- Enroll in courses
- Stream video content for enrolled courses only
- Manage profile and view an enrolled-courses dashboard

**Instructor**
- Create and publish courses
- Upload thumbnails and video content
- Structure courses into sections and lectures
- Edit course details and preview before publishing
- Manage their own course catalog and profile

---

## Tech stack

| Layer | Choices |
|---|---|
| Frontend | Next.js, React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Auth | Auth0, JWT |
| Storage | Supabase Storage (thumbnails, video, Signed URLs) |

---

## Database design

Core entities:
- **Users** — student/instructor accounts and profiles
- **Courses** — owned by an instructor
- **Sections** — group lectures within a course
- **Lectures** — individual video units
- **Enrollments** — links users to courses they can access

```text
User
 ├── Creates Courses (as Instructor)
 ├── Enrolls in Courses (as Student)
 └── Manages Profile

Course
 ├── Owned by Instructor
 └── Contains Sections

Section
 └── Contains Lectures

Lecture
 └── Contains Video Content (Supabase, Signed URL access)
```
