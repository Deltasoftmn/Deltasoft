# Deltasoft - IT Outsourcing Company Website

A modern, responsive website for Deltasoft IT Outsourcing Company, built with React (frontend) and Strapi (backend CMS).

## Features

- Modern, clean design with Mongolian language support
- Responsive layout that works on all devices
- React-based frontend with component-based architecture
- **Strapi** headless CMS for content, news, contacts, and media
- Custom color scheme: #b7e400 (lime green), #0a0a0a (black), and white

## Tech Stack

- **Frontend**: React 18, React Router
- **Backend**: Strapi 4 (Node.js)
- **Database**: SQLite (default; can switch to PostgreSQL)
- **Styling**: CSS3 with custom properties

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

2. Set up the Strapi backend (first time only):
```bash
cd backend
cp .env.example .env
# Edit .env if you need custom port or database
npm run develop
```
On first run, Strapi will prompt you to create an admin user. Use that to log in at http://localhost:1337/admin.

3. In Strapi Admin (http://localhost:1337/admin), go to **Settings → Users & Permissions → Roles → Public** and enable:
   - **Contact**: `create`
   - **News**: `find`, `findOne`
   - **Service**: `find`
   - **Project**: `find`

### Running the Application

Run both Strapi and frontend:
```bash
npm run dev
```

Or run them separately:

**Backend (Strapi):**
```bash
npm run server
```

**Frontend:**
```bash
npm run client
```

- **Frontend**: http://localhost:3000
- **Strapi API**: http://localhost:1337
- **Strapi Admin**: http://localhost:1337/admin

## Production: Vercel (frontend) + Strapi (backend)

To have the Vercel frontend fetch from your deployed Strapi (e.g. https://admin.deltasoft.website):

### 1. Vercel environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Name | Value | Notes |
|------|--------|--------|
| `REACT_APP_STRAPI_URL` | `https://admin.deltasoft.website` | Strapi API base (no trailing slash) |
| `REACT_APP_STRAPI_ADMIN_URL` | `https://admin.deltasoft.website/admin` | Optional; used for the "Админ" link in the footer |

Redeploy the frontend after saving so the build picks up these values.

### 2. Strapi CORS (allow your Vercel domain)

On the server where Strapi runs (e.g. admin.deltasoft.website), set environment variables so Strapi allows requests from your frontend:

- **FRONTEND_URL** = your Vercel site URL, e.g. `https://deltasoft.vercel.app` (no trailing slash)
- Or **CORS_ORIGINS** = comma-separated list, e.g. `https://deltasoft.vercel.app,https://deltasoft.website`

Restart Strapi after changing env so CORS is updated.

### 3. Strapi permissions

In Strapi Admin → **Settings → Users & Permissions → Roles → Public**, ensure:

- **Contact**: `create` ✓
- **News**: `find`, `findOne` ✓
- **Service**: `find` ✓
- **Project**: `find` ✓

## Project Structure

```
deltasoft/
├── frontend/          # React app (Create React App)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/           # Strapi 4 CMS
│   ├── config/
│   ├── src/
│   │   └── api/       # Content types: service, project, news, contact
│   └── package.json
└── package.json
```

## API (Strapi REST)

- `GET /api/services` - List services
- `GET /api/projects` - List projects (use `?filters[featured][$eq]=true` for featured)
- `GET /api/news` - List published news (use `?populate=image`)
- `POST /api/contacts` - Submit contact/quote (body: `{ data: { name, email, phone?, message } }`)

Content is managed in **Strapi Admin** (News, Contacts, Services, Projects).

## Color Scheme

- Primary Green: `#b7e400`
- Primary Black: `#0a0a0a`
- Primary White: `#ffffff`

## License

Copyright © 2026 Deltasoft. All rights reserved.
