# Next LMS

A full-stack Learning Management System (LMS) built using **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**.  
This project enables students to log in, view assigned lessons, mark them as complete, and track their progress seamlessly.

---

## 🎯 Functionality

### 🔐 Authentication
- Students log in using **Supabase Auth** (email/password).
- Unauthorized users are redirected to the login page.

### 📚 Dashboard
- Displays a list of all **upcoming lessons**.
- Each lesson includes a title and description.
- Users can **mark lessons as complete** with a confirmation modal.

### ✅ Completed Lessons
- A separate page lists all **completed lessons**.
- Includes the **completion timestamp**, formatted in **IST (Asia/Kolkata)**.

### 🕒 Timezone Support
- Timestamps are stored in UTC but **displayed in `dd/mm/yyyy, hh:mm` format in IST**.

### 🧾 Real-Time Data
- After completing a lesson, the UI updates immediately without needing a refresh.

---

## 🛠️ What I Implemented

As the sole developer of this project, I:

- ✅ **Set up the full Next.js App Router project** structure and routing
- 🔐 Integrated **Supabase Auth** and session management with custom `useSession` hook
- 📦 Designed and implemented the **Supabase schema** for:
  - `lessons`
  - `completed_lessons` (with `student_id`, `lesson_id`, `completed_at`)
- 📄 Created reusable React components for login, dashboard, modals, and loaders
- 📊 Fetched and displayed dynamic data using **Supabase client APIs**
- ✅ Implemented a modal-based confirmation for marking a lesson complete
- 🕓 Stored completion timestamps and **formatted them in `Asia/Kolkata` timezone**
- 🎨 Designed responsive UI using **Tailwind CSS** with accessible and minimal styling
- ⚡ Ensured smooth UX with loading spinners, error handling, and real-time data refresh

---

## 🚀 Getting Started

```bash
npm install
npm run dev
---