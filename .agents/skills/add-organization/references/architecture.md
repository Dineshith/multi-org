# Multi-Org CMS — Architecture Reference

This document is the canonical reference for understanding the folder structure,
design decisions, and conventions of the multi-org CMS project.

---

## Core Design Principle

> **One org = one folder. Everything that belongs to an org lives inside it.**

This is the **feature-based** (or "co-location") folder pattern. It means:
- You never have to hunt across `components/`, `pages/`, and `admin/` to find
  code for a single org.
- Adding a new org is mechanical: copy a folder, rename, customise.
- Deleting/archiving an org is safe: delete one folder, remove its routes.

---

## Full Target Folder Structure

```
multi-org/
├── frontend/
│   └── src/
│       ├── main.jsx                   # Vite entry point
│       ├── App.jsx                    # React Router root — all routes live here
│       ├── index.css                  # Global reset + design tokens
│       │
│       ├── config/
│       │   └── orgConfig.js           # WINGS, PROGRAMS, LEVELS, ORG_INFO constants
│       │
│       ├── hooks/                     # Shared custom React hooks (e.g. useAuth, useOrg)
│       ├── services/                  # API call wrappers (e.g. noticeService.js)
│       ├── assets/                    # Images, fonts, SVGs
│       │
│       ├── layouts/
│       │   └── AdminLayout.jsx        # Super-admin shell (not org-specific)
│       │
│       ├── organizations/
│       │   │
│       │   ├── main/                  # Main institution website
│       │   │   ├── pages/
│       │   │   │   ├── Home.jsx
│       │   │   │   ├── AboutPage.jsx
│       │   │   │   ├── FacultyPage.jsx
│       │   │   │   ├── ContactPage.jsx
│       │   │   │   └── ResearchPage.jsx
│       │   │   └── components/
│       │   │       ├── Navbar.jsx
│       │   │       ├── Hero.jsx
│       │   │       ├── Footer.jsx
│       │   │       ├── About.jsx
│       │   │       ├── Contact.jsx
│       │   │       ├── Faculty.jsx
│       │   │       ├── Gallery.jsx
│       │   │       ├── Research.jsx
│       │   │       └── Stats.jsx
│       │   │
│       │   ├── plus2/                 # +2 Wing website + admin
│       │   │   ├── pages/
│       │   │   │   ├── HomePage.jsx
│       │   │   │   ├── AboutPage.jsx
│       │   │   │   └── ContactPage.jsx
│       │   │   ├── components/
│       │   │   │   ├── Navbar.jsx
│       │   │   │   ├── Hero.jsx
│       │   │   │   ├── Footer.jsx
│       │   │   │   ├── Intro.jsx
│       │   │   │   ├── News.jsx
│       │   │   │   ├── NoticeBoard.jsx
│       │   │   │   ├── Offerings.jsx
│       │   │   │   ├── Testimonials.jsx
│       │   │   │   ├── WhyChooseUs.jsx
│       │   │   │   └── AboutSnippet.jsx
│       │   │   └── admin/
│       │   │       ├── layout/
│       │   │       │   └── Plus2AdminLayout.jsx
│       │   │       ├── components/
│       │   │       │   └── Plus2Sidebar.jsx
│       │   │       └── pages/
│       │   │           ├── Dashboard.jsx
│       │   │           ├── StudentManagement.jsx
│       │   │           ├── NoticeManagement.jsx
│       │   │           └── ResultManagement.jsx
│       │   │
│       │   ├── bachelors/             # (Future) Bachelors Wing
│       │   │   ├── pages/
│       │   │   ├── components/
│       │   │   └── admin/
│       │   │
│       │   └── school/               # (Future) School Wing
│       │       ├── pages/
│       │       ├── components/
│       │       └── admin/
│       │
│       └── admin/                     # Super-admin (cross-org management)
│           ├── components/
│           │   └── Sidebar.jsx
│           └── pages/
│               ├── AdminLogin.jsx
│               ├── Dashboard.jsx
│               ├── OrganizationManagement.jsx
│               ├── StudentManagement.jsx
│               ├── NoticeManagement.jsx
│               ├── ResultManagement.jsx
│               └── Gallery.jsx
│
└── backend/
    ├── server.js                      # Express entry point
    └── src/
        ├── config/
        │   └── db.js                  # PostgreSQL/DB connection
        ├── middleware/
        │   └── authMiddleware.js      # JWT protect middleware
        ├── controllers/               # One file per resource (per org if needed)
        │   ├── authController.js
        │   ├── contactController.js
        │   └── noticeController.js
        └── routes/                    # One file per resource
            ├── authRoutes.js
            ├── contactRoutes.js
            └── noticeRoutes.js
```

---

## Routing Convention

| Path pattern | What it is |
|---|---|
| `/` | Redirects to `/home` |
| `/home`, `/about`, `/faculty` | Main org public pages |
| `/plus2`, `/plus2/about` | Plus2 wing public pages |
| `/{slug}`, `/{slug}/about` | Future org public pages |
| `/admin` | Super-admin panel (manages all orgs) |
| `/{slug}/admin` | Org-specific admin panel |
| `/{slug}/admin/students` | Org-scoped student management |

---

## Two Types of Admin

| Type | Path | Purpose |
|---|---|---|
| **Super-admin** | `/admin` | Cross-org: view all orgs, global settings, user management |
| **Org-admin** | `/{slug}/admin` | Scoped to one org: students, notices, results for that org only |

The super-admin uses `src/admin/` and `src/layouts/AdminLayout.jsx`.
Each org-admin lives inside `src/organizations/{slug}/admin/`.

---

## Shared Config (`src/config/orgConfig.js`)

This file is the **single source of truth** for:
- `WINGS` — list of active org names (drives dropdowns everywhere)
- `PROGRAMS` — programs per wing
- `LEVELS` — semesters/years per program
- `ORG_INFO` — placeholder org metadata (will come from API in future)
- `BLOOD_GROUPS`, `GENDERS`, `STUDENT_STATUSES` — universal lookup values

**Always import from `src/config/orgConfig`**, never from `admin/config/orgConfig`.

---

## Backend Conventions

- **One controller per resource** (e.g. `noticeController.js`)
- If an org needs its own scoped controller, prefix with the slug:
  `bachelorsNoticeController.js`
- All routes are mounted under `/api/{resource}` for global resources
  or `/api/{slug}/{resource}` for org-scoped resources
- The `protect` middleware from `authMiddleware.js` should guard all
  write operations

---

## "New Org" Triggers That Require Config Update

Whenever adding a new org, these files **always** need updating:

1. `src/config/orgConfig.js` — add to WINGS, PROGRAMS, LEVELS
2. `src/App.jsx` — add public routes + admin routes
3. `backend/server.js` — register new route files

All other work (pages, components, admin) is contained inside the new
`organizations/{slug}/` folder.
