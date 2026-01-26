# Admin User Setup

## Create Admin User

To create the default admin user in MongoDB, run:

```bash
cd backend
npm install
npm run create-admin
```

This will create an admin user with:
- **Username:** `admin`
- **Password:** `admin123`

The password will be automatically hashed using bcrypt before being stored in the database.

## Admin Login

Once the admin user is created, you can log in at:
- **URL:** `http://localhost:3000/admin`
- **Username:** `admin`
- **Password:** `admin123`

## Notes

- The script checks if an admin user already exists before creating a new one
- If an admin user with username "admin" already exists, the script will skip creation
- The password is hashed using bcrypt with salt rounds of 10

