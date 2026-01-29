const { findAdminByUsername, createAdmin } = require('../models/adminSupabase');
require('dotenv').config();

async function setupAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await findAdminByUsername('admin');
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
      return;
    }

    // Create new admin user
    await createAdmin('admin', 'admin123');
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

setupAdmin();

