const supabase = require('../utils/supabaseClient');
const bcrypt = require('bcryptjs');

async function findAdminByUsername(username) {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('username', username)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found" error, which is fine
    throw error;
  }

  return data;
}

async function comparePassword(hashedPassword, candidatePassword) {
  return await bcrypt.compare(candidatePassword, hashedPassword);
}

async function createAdmin(username, password) {
  // Hash password before storing
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const { data, error } = await supabase
    .from('admins')
    .insert([{ username, password: passwordHash }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  findAdminByUsername,
  comparePassword,
  createAdmin,
};
