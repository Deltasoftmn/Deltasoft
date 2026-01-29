const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../utils/supabaseClient');

// Check if Supabase is configured
if (!supabase || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Supabase is not properly configured. Please check your .env file.');
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large. Maximum size is 5MB.',
        error: err.message 
      });
    }
    return res.status(400).json({ 
      message: 'File upload error',
      error: err.message 
    });
  }
  if (err) {
    return res.status(400).json({ 
      message: err.message || 'File upload error',
      error: err.message 
    });
  }
  next();
};

// Upload image to Supabase Storage
router.post('/image', upload.single('image'), handleMulterError, async (req, res) => {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.error('Supabase client not initialized');
      return res.status(500).json({ 
        message: 'Supabase is not configured. Please check your .env file.',
        error: 'Supabase client not initialized. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    console.log('Uploading file:', {
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = req.file.originalname.split('.').pop() || 'jpg';
    const fileName = `news/${timestamp}-${randomString}.${fileExtension}`;

    console.log('Uploading to Supabase Storage:', fileName);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('news-images')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error details:', JSON.stringify(error, null, 2));
      // Check if bucket doesn't exist
      if (error.message && (error.message.includes('Bucket') || error.message.includes('bucket'))) {
        return res.status(500).json({ 
          message: 'Storage bucket not found. Please create "news-images" bucket in Supabase Storage.',
          error: error.message 
        });
      }
      return res.status(500).json({ 
        message: 'Failed to upload image', 
        error: error.message || JSON.stringify(error)
      });
    }

    console.log('Upload successful, getting public URL...');

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('news-images')
      .getPublicUrl(fileName);

    console.log('URL data:', urlData);

    const publicUrl = urlData?.publicUrl || urlData;

    if (!publicUrl) {
      console.error('Failed to get public URL, urlData:', urlData);
      return res.status(500).json({ 
        message: 'Failed to get image URL',
        error: 'Public URL not available',
        debug: urlData
      });
    }

    console.log('Upload complete, public URL:', publicUrl);

    res.json({
      message: 'Image uploaded successfully',
      url: publicUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to upload image', 
      error: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
