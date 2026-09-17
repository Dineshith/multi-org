# Multi-Org Education Platform

A **MERN stack multi-organization website** where a single backend serves multiple educational institution frontends — School, Plus2/College, and Bachelors.

---

## 🏗️ Project Architecture

```
multi-org/
├── backend/          → Node.js + Express API (shared by all modules)
│   └── src/
│       ├── controllers/    → authController, contactController, noticeController
│       ├── routes/         → authRoutes, contactRoutes, noticeRoutes
│       ├── middleware/     → auth middleware
│       └── config/         → DB config
├── frontend/         → React + Vite
│   └── src/
│       ├── pages/          → Landing/main site pages
│       ├── school/         → School website module
│       │   ├── components/ → Navbar, Hero, About, Gallery, etc.
│       │   └── pages/      → Home, AboutUs, Teachers, Gallery, Events, etc.
│       ├── bachelor/       → Bachelor/College website module
│       │   ├── components/ → Navbar, Hero, Footer, NoticeBoard, etc.
│       │   └── pages/      → Home, About, Programs, Faculty, Notice, Gallery, Contact, Results
│       └── admin/          → Admin panel
│           ├── components/ → Sidebar
│           ├── config/     → orgConfig (Wings, Programs, Levels)
│           └── pages/      → Dashboard, StudentManagement, NoticeManagement,
│                              ResultManagement, Gallery, OrganizationManagement, AdminLogin
```

---

## 🌐 URL Routes

| Route | Module | Description |
|-------|--------|-------------|
| `/home` | Landing | Main landing/home page |
| `/school/home` | School | School website home |
| `/school/about` | School | About the school |
| `/school/teachers` | School | Teachers listing |
| `/school/gallery` | School | Photo gallery |
| `/school/events` | School | Events |
| `/school/scholarship` | School | Scholarship info |
| `/school/contact` | School | Contact form |
| `/bachelor/` | Bachelor | College home page |
| `/bachelor/about` | Bachelor | About the college ✅ new |
| `/bachelor/programs` | Bachelor | BCA, CSIT, BBS, BIT, BSc ✅ new |
| `/bachelor/faculty` | Bachelor | Faculty listing ✅ new |
| `/bachelor/notice` | Bachelor | Notice board ✅ new |
| `/bachelor/gallery` | Bachelor | Photo gallery ✅ new |
| `/bachelor/contact` | Bachelor | Contact form ✅ new |
| `/bachelor/results` | Bachelor | Exam results ✅ new |
| `/admin/login` | Admin | Admin login page |
| `/admin` | Admin | Dashboard (protected) |
| `/admin/students` | Admin | Student management (CRUD + ID card print) |
| `/admin/notice` | Admin | Notice management |
| `/admin/results` | Admin | Results upload |
| `/admin/gallery` | Admin | Gallery management ✅ improved |
| `/admin/organization` | Admin | Organization setup |

---

## 🚀 How to Run

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Storage | localStorage (admin panel CRUD) |

---

## 🔐 Admin Login

- URL: `/admin/login`
- Credentials stored in backend `.env` / MongoDB
- JWT token saved to `localStorage` as `adminToken`
- Protected routes redirect to login if no token present

---

## 📝 What Changed (Changelog)

### v2.0 — September 2081 (Latest)

#### 🎓 Bachelor/College Website — 7 New Pages Added
- **About** (`/bachelor/about`) — Mission, vision, values, timeline of milestones
- **Programs** (`/bachelor/programs`) — BCA, CSIT, BBS, BIT, BSc with expandable subject/eligibility details
- **Faculty** (`/bachelor/faculty`) — Filterable faculty cards with qualifications, subjects, experience
- **Notice** (`/bachelor/notice`) — Searchable/filterable notice board with pinned notices and expandable content
- **Gallery** (`/bachelor/gallery`) — Masonry photo grid with lightbox; reads images from Admin Gallery
- **Contact** (`/bachelor/contact`) — Full contact form (connected to `/api/contact` backend), Google Maps embed
- **Results** (`/bachelor/results`) — Exam results viewer; reads from Admin Results localStorage

#### 🧭 Bachelor Navbar — Updated
- All nav links now use React Router `NavLink` for proper routing
- Desktop dropdown menus point to real pages
- Mobile menu updated with all 8 pages

#### 📊 Admin Dashboard — Complete Rewrite
- Student stats cards: Total, Active, School, Plus2, Bachelors
- Quick Action buttons (Add Student, Post Notice, Manage Results, Organization Setup)
- Platform module overview cards

#### 🖼️ Admin Gallery — Full Implementation
- Drag-and-drop image upload
- Category management (General, Events, Sports, Cultural, Academic, Infrastructure)
- Grid and List view toggle
- Bulk delete with checkboxes
- Toast notifications
- Images persisted to localStorage

#### 🔒 Admin Auth Guard — Enabled
- Protected route now active (was temporarily disabled)
- Unauthenticated access to `/admin/*` redirects to `/admin/login`
- LogOut button in Sidebar properly clears session

---

## 👥 Contributors

| Name | Branch | Module |
|------|--------|--------|
| Dinesh | `dinesh-branch` | Bachelor module, Admin improvements |
| Karuna | `karuna-iic` | School contact, gallery, notices |
| Others | various | School website components |
