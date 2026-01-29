# Environment Setup

Create a `.env` file in the `backend` directory with the following content:

```
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** (this is your `SUPABASE_URL`)
4. Copy the **service_role** key (this is your `SUPABASE_SERVICE_ROLE_KEY`)
   - ⚠️ **Important**: Use the `service_role` key, NOT the `anon` key. The service_role key has admin privileges and should only be used server-side.

## Setting Up Supabase Storage (for News Images)

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Name it: `news-images`
5. Make it **Public** (so images can be accessed via URL)
6. Click **Create bucket**

## Creating Admin User

After setting up your `.env` file, run:

```bash
node scripts/createAdmin.js
```

This will create a default admin user:
- Username: `admin`
- Password: `admin123`

⚠️ **Change these credentials in production!**

