const supabase = require('../utils/supabaseClient');

async function getAllServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

async function createService(serviceData) {
  const { data, error } = await supabase
    .from('services')
    .insert([serviceData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  getAllServices,
  createService,
};
