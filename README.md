# eduKnow - Learning Management System (LMS)

A full-stack Learning Management System (LMS) that enables instructors to create and manage online courses while allowing students to browse, enroll, and securely access video-based content.

The platform implements role-based access control, secure video delivery using Supabase Signed URLs, and authentication through Auth0.

---

## Tech Stack

### Frontend
- Next.js
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Authentication & Authorization
- Auth0
- JWT (JSON Web Tokens)

### Cloud Storage
- Supabase Storage
  - Course thumbnails
  - Course videos
  - Secure Signed URL generation

---

## Features

### Student Features

- Browse all available courses
- View detailed course information
- Enroll in courses
- Access purchased/enrolled content
- Watch videos securely
- Manage profile information
- View enrolled courses dashboard

### Instructor Features

- Create new courses
- Upload course thumbnails
- Add sections and lectures
- Upload video content
- Edit course details
- Manage personal courses
- Preview courses before publishing
- Update instructor profile

### Authentication & Security

- Auth0 authentication
- Secure login and registration
- JWT-based authorization
- Role-based access control
- Protected API routes
- Secure content access

### Video Delivery System

- Videos stored in Supabase Storage
- Secure Signed URLs generated dynamically
- Prevents direct public access to video files
- Only enrolled users can access course content

---

## System Architecture

### User Roles

#### Student

- Browse courses
- Enroll in courses
- Access enrolled courses
- Watch course videos
- Manage profile

#### Instructor

- Create courses
- Upload videos
- Manage sections
- Edit course content
- Manage profile

---

## Database Design

Core entities include:

- Users
- Courses
- Sections
- Lectures
- Enrollments
- User Profiles

Relationships:

```text
User
 ├── Creates Courses
 ├── Enrolls in Courses
 └── Manages Profile

Course
 ├── Contains Sections
 └── Owned by Instructor

Section
 └── Contains Lectures

Lecture
 └── Contains Video Content
