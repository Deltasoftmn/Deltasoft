# Strapi Backend Setup

## First-time setup

1. **Environment**
   ```bash
   cp .env.example .env
   ```
   Strapi will generate `APP_KEYS` and JWT secrets on first run if not set.

2. **Install and run**
   ```bash
   npm install
   npm run develop
   ```
   On first run you will be asked to create an admin user (email + password). Use this to log in at http://localhost:1337/admin.

3. **Permissions**
   In **Settings → Users & Permissions → Roles → Public**, enable:
   - **Contact**: `create` (so the website contact form can submit)
   - **News**: `find`, `findOne`
   - **Service**: `find`
   - **Project**: `find`

## Content types

- **Service** – title, description, icon, actionText
- **Project** – title, description, image, technologies (JSON), featured (boolean)
- **News** – title, content, image; uses Draft & Publish (only published items appear on the site)
- **Contact** – name, email, phone, message, status (new / read / replied)

## Port

Default port is **1337**. Override with `PORT=5000` in `.env` if needed (and update the frontend proxy in `frontend/package.json`).

## Database

Default is **SQLite** (`.tmp/data.db`). To use PostgreSQL, set in `.env`:

```
DATABASE_CLIENT=postgres
DATABASE_FILENAME=
HOST=your-db-host
PORT=5432
DATABASE=your-db-name
USERNAME=your-user
PASSWORD=your-password
SSL=false
```

And install the client: `npm install pg`.
