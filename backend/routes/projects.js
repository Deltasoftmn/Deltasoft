const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getFeaturedProjects,
  createProject,
} = require('../models/projectSupabase');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Get featured projects
router.get('/featured', async (req, res) => {
  try {
    const projects = await getFeaturedProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({ message: 'Failed to fetch featured projects' });
  }
});

// Create a project
router.post('/', async (req, res) => {
  try {
    const project = await createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: 'Failed to create project' });
  }
});

module.exports = router;

