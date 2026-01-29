const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
} = require('../models/contactSupabase');

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const contact = await createContact(req.body);
    res
      .status(201)
      .json({ message: 'Contact form submitted successfully', contact });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(400).json({ message: 'Failed to submit contact form' });
  }
});

// Get all contacts (admin)
router.get('/', async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

// Update contact status
router.patch('/:id', async (req, res) => {
  try {
    const contact = await updateContactStatus(req.params.id, req.body.status);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ message: 'Failed to update contact status' });
  }
});

// Delete contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await deleteContact(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Failed to delete contact' });
  }
});

module.exports = router;

