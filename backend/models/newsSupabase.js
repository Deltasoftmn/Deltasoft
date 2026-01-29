const supabase = require('../utils/supabaseClient');

async function getAllNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

async function getPublishedNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

async function getNewsById(id) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function createNews(newsData) {
  const { data, error } = await supabase
    .from('news')
    .insert([newsData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function updateNews(id, newsData) {
  const { data, error } = await supabase
    .from('news')
    .update(newsData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function deleteNews(id) {
  const { data, error } = await supabase
    .from('news')
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
  getAllNews,
  getPublishedNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
