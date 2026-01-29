const express = require('express');
const router = express.Router();
const {
  getAllNews,
  getPublishedNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} = require('../models/newsSupabase');

// Get all news (admin - includes unpublished)
router.get('/all', async (req, res) => {
  try {
    const news = await getAllNews();
    res.json(news);
  } catch (error) {
    console.error('Error fetching all news:', error);
    res.status(500).json({ message: 'Failed to fetch news' });
  }
});

// Get published news only (public)
router.get('/', async (req, res) => {
  try {
    const news = await getPublishedNews();
    res.json(news);
  } catch (error) {
    console.error('Error fetching published news:', error);
    res.status(500).json({ message: 'Failed to fetch news' });
  }
});

// Get single news by ID
router.get('/:id', async (req, res) => {
  try {
    const news = await getNewsById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Failed to fetch news' });
  }
});

// Create news (admin)
router.post('/', async (req, res) => {
  try {
    const news = await createNews(req.body);
    res.status(201).json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(400).json({ message: 'Failed to create news' });
  }
});

// Update news (admin)
router.put('/:id', async (req, res) => {
  try {
    const news = await updateNews(req.params.id, req.body);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Failed to update news' });
  }
});

// Delete news (admin)
router.delete('/:id', async (req, res) => {
  try {
    const news = await deleteNews(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Failed to delete news' });
  }
});

module.exports = router;
