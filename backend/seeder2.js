// seeder2.js - Upload local product images to Cloudinary and update MongoDB
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import Product from './models/productModel.js'; // Adjust if needed

// Handle ES Modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// FIXED: Correct path to the images directory
// Remove the duplicate 'images' folders in the path
const imageDir = path.join(__dirname, '..', 'frontend', 'public', 'images');

// Upload a local file to Cloudinary
const uploadToCloudinary = async (localPath) => {
  if (!fs.existsSync(localPath)) {
    console.warn(`⚠️ File not found: ${localPath}`);
    
    // Try alternative paths if the file is not found
    const filename = path.basename(localPath);
    const alternativePaths = [
      path.join(__dirname, '..', 'frontend', 'public', 'images', filename),
      path.join(__dirname, '..', 'frontend', 'public', filename),
      path.join(__dirname, '..', 'frontend', 'src', 'assets', filename),
    ];
    
    for (const altPath of alternativePaths) {
      if (fs.existsSync(altPath)) {
        console.log(`✅ Found file at alternative location: ${altPath}`);
        return uploadToCloudinary(altPath);
      }
    }
    
    return null;
  }
  
  try {
    const result = await cloudinary.v2.uploader.upload(localPath, {
      folder: 'timeless-ecom/products',
      use_filename: true,
      unique_filename: true,
    });
    console.log(`✅ Uploaded: ${localPath} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error(`❌ Upload error: ${localPath}`, err);
    return null;
  }
};

// Update MongoDB product document with Cloudinary URL
const updateProductImage = async (product, newUrl) => {
  try {
    product.image = newUrl;
    await product.save();
    console.log(`✅ Updated product ${product._id}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to update product ${product._id}`, err);
    return false;
  }
};

// Debug function to locate image files
const findImageFiles = async () => {
  console.log('🔍 Searching for image files...');
  
  // List of directories to search
  const searchDirs = [
    path.join(__dirname, '..', 'frontend', 'public', 'images'),
    path.join(__dirname, '..', 'frontend', 'public'),
    path.join(__dirname, '..', 'frontend', 'src', 'assets'),
    path.join(__dirname, '..', 'frontend'),
  ];
  
  // List of common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const foundImages = [];
  
  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) {
      console.log(`Directory does not exist: ${dir}`);
      continue;
    }
    
    try {
      console.log(`Searching in: ${dir}`);
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          // We could recursively search here if needed
          continue;
        }
        
        const ext = path.extname(file).toLowerCase();
        if (imageExtensions.includes(ext)) {
          foundImages.push(fullPath);
          console.log(`Found image: ${fullPath}`);
        }
      }
    } catch (err) {
      console.error(`Error searching directory ${dir}:`, err);
    }
  }
  
  console.log(`Found ${foundImages.length} images in total.`);
  return foundImages;
};

// Migration process
const migrateImages = async () => {
  try {
    // First, locate available image files
    const availableImages = await findImageFiles();
    
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products`);
    
    let success = 0;
    let failed = 0;
    
    for (const product of products) {
      const relativeImagePath = product.image;
      
      // Skip if already on Cloudinary
      if (relativeImagePath && relativeImagePath.startsWith('http')) {
        console.log(`ℹ️ Skipping already hosted image: ${product._id}`);
        success++;
        continue;
      }
      
      // Try to find the image based on filename
      const imageFilename = relativeImagePath ? path.basename(relativeImagePath) : null;
      let foundImage = null;
      
      if (imageFilename) {
        // First try the exact path
        const fullImagePath = path.join(imageDir, relativeImagePath);
        console.log(`🚀 Processing: ${fullImagePath}`);
        
        if (fs.existsSync(fullImagePath)) {
          foundImage = fullImagePath;
        } else {
          // Search in available images
          foundImage = availableImages.find(img => path.basename(img) === imageFilename);
          
          if (foundImage) {
            console.log(`🔍 Found image with matching filename: ${foundImage}`);
          } else {
            console.warn(`⚠️ Image not found for product ${product._id} (${imageFilename})`);
          }
        }
      } else {
        console.warn(`⚠️ No image path for product ${product._id}`);
      }
      
      if (foundImage) {
        const cloudinaryUrl = await uploadToCloudinary(foundImage);
        if (cloudinaryUrl) {
          const updated = await updateProductImage(product, cloudinaryUrl);
          updated ? success++ : failed++;
        } else {
          console.warn(`⚠️ Skipped product ${product._id} (upload failed)`);
          failed++;
        }
      } else {
        console.warn(`⚠️ Skipped product ${product._id} (image not found)`);
        failed++;
      }
    }
    
    console.log('\n🧾 Migration Summary:');
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📦 Total: ${products.length}`);
  } catch (err) {
    console.error('🔥 Migration failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 Disconnected from MongoDB');
  }
};

// Start migration
migrateImages();