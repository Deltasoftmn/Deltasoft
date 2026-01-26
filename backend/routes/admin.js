const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Contact = require('../models/Contact');
const multer = require('multer');
const XLSX = require('xlsx');
const puppeteer = require('puppeteer');
const generateInvoiceHtml = require('../utils/invoiceTemplate');

const upload = multer({ storage: multer.memoryStorage() });

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Success - in production, you would generate a JWT token here
    res.json({ 
      message: 'Login successful',
      username: admin.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get statistics
router.get('/statistics', async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const pendingQuotes = await Contact.countDocuments({ status: 'new' });
    
    // In production, you would track visits in a separate collection
    // For now, return demo data
    res.json({
      totalVisits: 1250,
      todayVisits: 45,
      totalContacts: totalContacts,
      pendingQuotes: pendingQuotes
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Excel to PDF (invoice) conversion
router.post('/excel-to-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Excel файл илгээгээгүй байна.' });
    }

    // Parse Excel buffer
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (!rows || rows.length < 2) {
      return res.status(400).json({ message: 'Excel файлд өгөгдөл алга байна.' });
    }

    // Expect header row: [Нэрс, Огноо, Нэгж үнэ, Нийт үнэ]
    const dataRows = rows.slice(1).filter(r => r && r.length);
    const items = dataRows.map((r) => ({
      name: r[0],
      date: r[1],
      unitPrice: r[2],
      totalPrice: r[3],
    }));

    const html = generateInvoiceHtml(items);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=invoice.pdf'
    );
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('Excel to PDF error:', error);
    return res.status(500).json({ message: 'Excel-ийг PDF болгох үед алдаа гарлаа.' });
  }
});

module.exports = router;

