const express = require('express');
const router = express.Router();
const { getAllServices, createService } = require('../models/serviceSupabase');

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await getAllServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// Create a service
router.post('/', async (req, res) => {
  try {
    const service = await createService(req.body);
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(400).json({ message: 'Failed to create service' });
  }
});

module.exports = router;

