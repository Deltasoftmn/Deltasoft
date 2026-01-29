const supabase = require('../utils/supabaseClient');

async function createContact(data) {
  const { data: inserted, error } = await supabase
    .from('contacts')
    .insert([data])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return inserted;
}

async function getAllContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

async function updateContactStatus(id, status) {
  const { data, error } = await supabase
    .from('contacts')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function deleteContact(id) {
  const { data, error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
};

