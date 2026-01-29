const supabase = require('../utils/supabaseClient');

async function getAllProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

async function getFeaturedProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

async function createProject(projectData) {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  getAllProjects,
  getFeaturedProjects,
  createProject,
};
