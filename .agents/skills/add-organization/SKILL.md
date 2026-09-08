---
name: add-organization
description: >-
  Use this skill when the user asks to add a new organization, wing, branch, or
  sub-site to the multi-org CMS project. Covers the complete checklist for
  scaffolding the frontend public site, the org-specific admin panel, backend
  routes/controllers, and wiring everything into the router and shared config.
  Always read this skill before starting any "new org" task.
---

# Add a New Organization / Wing to the Multi-Org CMS

This skill is your definitive runbook for extending the multi-org CMS with a
new organization (e.g., "Bachelors", "School", "Hostel"). Follow every step
in order. Do not skip sections — each one has a dependency on the previous.

> Read [`references/architecture.md`](./references/architecture.md) for the
> full folder-by-folder explanation of why the structure is designed this way.

---

## Pre-Flight Checklist

Before writing any code, answer these questions with the user:

- [ ] What is the **slug** of the new org? (lowercase, no spaces — e.g. `bachelors`, `school`)
- [ ] What is the **display name**? (e.g. `Bachelors`, `School Wing`)
- [ ] What **programs** does it offer? (e.g. BCA, BBS, CSIT — needed for `orgConfig.js`)
- [ ] What **levels** (semesters/years) does each program have?
- [ ] Does it need a **public-facing website** (yes for all orgs)?
- [ ] Does it need its own **admin panel** section (yes for all orgs)?
- [ ] Which **backend resources** does it need? (students, notices, results, gallery, contact?)

---

## Step 1 — Update Shared Config

**File:** [`frontend/src/config/orgConfig.js`](file:///c:/Users/Kaushal%20Ghimire/OneDrive/Documents/multi%20org/multi-org/frontend/src/config/orgConfig.js)

Add the new org to:

1. `WINGS` array — append the display name (e.g. `'Bachelors'`)
2. `PROGRAMS` object — add a new key matching the wing name with an array of program objects:
   ```js
   Bachelors: [
     { id: 'bca', name: 'BCA', type: 'semester' },
     { id: 'bbs', name: 'BBS', type: 'year' },
   ]
   ```
3. `LEVELS` object — add entries for each program id:
   ```js
   bca: ['1st Sem', '2nd Sem', ..., '8th Sem'],
   bbs: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
   ```

---

## Step 2 — Scaffold Frontend Public Site

Create the following folder structure (replace `{slug}` with the org slug):

```
frontend/src/organizations/{slug}/
├── pages/
│   ├── HomePage.jsx
│   ├── AboutPage.jsx
│   └── ContactPage.jsx
└── components/
    ├── Navbar.jsx
    ├── Hero.jsx
    ├── Footer.jsx
    └── (add more org-specific components as needed)
```

### Page Template

Every page file should follow this minimal pattern:

```jsx
// frontend/src/organizations/{slug}/pages/HomePage.jsx
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      {/* Add org-specific sections here */}
      <Footer />
    </>
  );
}
```

### Component Template — Navbar

Copy the closest existing org's `Navbar.jsx` as a starting point and update:
- The org display name / logo
- Navigation links (use `/{slug}`, `/{slug}/about`, `/{slug}/contact`)

---

## Step 3 — Scaffold Org-Specific Admin Panel

Each org has its own scoped admin area. Create:

```
frontend/src/organizations/{slug}/admin/
├── layout/
│   └── {Slug}AdminLayout.jsx      # sidebar + outlet shell
├── components/
│   └── {Slug}Sidebar.jsx          # org-scoped sidebar nav
└── pages/
    ├── Dashboard.jsx
    ├── StudentManagement.jsx       # copy & adapt from main admin
    ├── NoticeManagement.jsx
    └── ResultManagement.jsx
```

### Admin Layout Template

```jsx
// frontend/src/organizations/{slug}/admin/layout/{Slug}AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import {Slug}Sidebar from '../components/{Slug}Sidebar';

export default function {Slug}AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <{Slug}Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
```

### Sidebar Nav Links

The sidebar should only show pages relevant to this org. Example for `bachelors`:
```
Dashboard → /{slug}/admin
Students  → /{slug}/admin/students
Notices   → /{slug}/admin/notices
Results   → /{slug}/admin/results
```

---

## Step 4 — Wire Up Routes in App.jsx

**File:** [`frontend/src/App.jsx`](file:///c:/Users/Kaushal%20Ghimire/OneDrive/Documents/multi%20org/multi-org/frontend/src/App.jsx)

Add two new route blocks — one for the public site and one for the admin:

```jsx
{/* ================= {SLUG} PUBLIC SITE ================= */}
<Route path="/{slug}" element={<{Slug}Home />} />
<Route path="/{slug}/about" element={<{Slug}About />} />
<Route path="/{slug}/contact" element={<{Slug}Contact />} />

{/* ================= {SLUG} ADMIN ================= */}
<Route path="/{slug}/admin" element={<{Slug}AdminLayout />}>
  <Route index element={<{Slug}Dashboard />} />
  <Route path="students" element={<{Slug}StudentManagement />} />
  <Route path="notices" element={<{Slug}NoticeManagement />} />
  <Route path="results" element={<{Slug}ResultManagement />} />
  <Route path="*" element={<{Slug}Dashboard />} />
</Route>
```

Import all components at the top of `App.jsx` grouped under a comment:
```jsx
// ---- {Slug} Org ----
import {Slug}Home from './organizations/{slug}/pages/HomePage';
import {Slug}About from './organizations/{slug}/pages/AboutPage';
import {Slug}Contact from './organizations/{slug}/pages/ContactPage';
import {Slug}AdminLayout from './organizations/{slug}/admin/layout/{Slug}AdminLayout';
import {Slug}Dashboard from './organizations/{slug}/admin/pages/Dashboard';
import {Slug}StudentManagement from './organizations/{slug}/admin/pages/StudentManagement';
import {Slug}NoticeManagement from './organizations/{slug}/admin/pages/NoticeManagement';
import {Slug}ResultManagement from './organizations/{slug}/admin/pages/ResultManagement';
```

---

## Step 5 — Backend: Add Controllers & Routes

For each new resource the org needs, follow this pattern:

### Controller

**File:** `backend/src/controllers/{slug}{Resource}Controller.js`

```js
// backend/src/controllers/bachelorsNoticeController.js
import pool from '../config/db.js';

export const getNotices = async (req, res) => {
  // scope all queries by org/wing
  const { rows } = await pool.query(
    'SELECT * FROM notices WHERE wing = $1 ORDER BY created_at DESC',
    ['{slug}']
  );
  res.json(rows);
};

// add create, update, delete following the same pattern
```

### Route File

**File:** `backend/src/routes/{slug}{Resource}Routes.js`

```js
import express from 'express';
import { getNotices } from '../controllers/{slug}NoticeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotices);
// router.post('/', protect, createNotice);

export default router;
```

### Register in server.js

**File:** [`backend/server.js`](file:///c:/Users/Kaushal%20Ghimire/OneDrive/Documents/multi%20org/multi-org/backend/server.js)

```js
import {slug}NoticeRoutes from './src/routes/{slug}NoticeRoutes.js';

app.use('/api/{slug}/notices', {slug}NoticeRoutes);
```

---

## Step 6 — Verification

Run through this checklist before marking the task done:

```bash
# 1. Start the dev server and watch for import errors
cd frontend && npm run dev

# 2. Start the backend
cd backend && node server.js
```

Then manually verify in the browser:

- [ ] `/{slug}` → public homepage loads
- [ ] `/{slug}/about` → about page loads
- [ ] `/{slug}/contact` → contact page loads  
- [ ] `/{slug}/admin` → admin layout + dashboard loads
- [ ] `/{slug}/admin/students` → student management loads
- [ ] `/{slug}/admin/notices` → notice management loads
- [ ] No console errors for missing imports
- [ ] Shared `orgConfig.js` constants (WINGS, PROGRAMS) correctly include the new org

---

## Common Mistakes to Avoid

| Mistake | Fix |
|---|---|
| Putting a new org's components inside `src/components/` | Always put them in `src/organizations/{slug}/components/` |
| Importing `orgConfig.js` from `admin/config/orgConfig` | Import from `src/config/orgConfig` |
| Using a shared admin layout for an org-specific admin | Each org should have its own `{Slug}AdminLayout` |
| Forgetting to update `WINGS` in `orgConfig.js` | `StudentManagement` and `ResultManagement` use this for dropdowns |
| Hard-coding the org name instead of reading from `ORG_INFO` | Use the config — it will eventually come from the API |
