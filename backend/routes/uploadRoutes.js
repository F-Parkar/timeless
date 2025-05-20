import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const storage = multer.memoryStorage(); // Store in memory
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Images only!'), false);
    }
  },
});

// Upload image to Cloudinary
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;

    const result = await cloudinary.uploader.upload_stream(
      { folder: 'ecommerce_uploads' }, // Optional: name your folder
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }
        return res.status(200).json({
          message: 'Image uploaded to Cloudinary successfully',
          image: result.secure_url,
        });
      }
    );

    // Manually pipe the buffer into the stream
    result.end(fileBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
