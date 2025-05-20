import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = process.env.PAGE_SIZE;
    const page = Number(req.query.pageNumber) || 1; //get page number from query string

    const keyword = req.query.keyword 
        ? { name: {$regex: req.query.keyword, $options: 'i' } } 
        : {};

    const count = await Product.countDocuments({...keyword}); //count all products

    const products = await Product.find({...keyword}) //empty opject brings all
        .limit(pageSize)
        .skip(pageSize * (page - 1)); //skip the products that are already shown
    res.json({products, page, pages: Math.ceil(count / pageSize)}); //send products and total pages
});

// @desc    Fetch a products
// @route   GET /api/products
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
       return res.json(product);
    }
    else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const products = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: 'https://res.cloudinary.com/dtv3tvtzm/image/upload/v1747723486/sample_jeytzg.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    });

    const createdProduct = await products.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if(product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    }
    else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Step 1: Extract public_id from Cloudinary image URL
    const imageUrl = product.image;
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = imageUrl.match(regex);

    if (match) {
      const publicId = match[1]; // This is what's needed for deletion

      // Step 2: Delete image from Cloudinary
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image with public_id: ${publicId}`);
      } catch (err) {
        console.error('Cloudinary deletion failed:', err.message);
        // Optional: Continue deleting the product even if image deletion fails
      }
    }

    // Step 3: Delete the product from DB
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: 'Product and image removed' });
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if(product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());

        if(alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length; //average rating

        await product.save();
        res.status(201).json({ message: 'Review added' });
    }
    else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3); //top 3 products
    res.status(200).json(products);
});


export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts };