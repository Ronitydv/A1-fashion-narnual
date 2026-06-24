const express = require('express');
const router = express.Router();
const { readProducts, writeProducts, readReviews, writeReviews } = require('../config/db');
const { protect, isAdmin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products with filters and sorting
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, size, maxPrice, search, sort } = req.query;
    let products = readProducts();

    // Filter by Category
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    // Filter by Size
    if (size && size !== 'all') {
      products = products.filter(p => p.sizes.includes(size));
    }

    // Filter by Max Price
    if (maxPrice) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    // Search keywords
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // Sorting options
    if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'best-selling') {
      products.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)); // Sort by bestselling salesCount!
    } else {
      // Default: featured first
      products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get a single product details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { title, price, originalPrice, category, image, sizes, colors, description, inStock, specs } = req.body;
    const products = readProducts();

    const newProduct = {
      id: Date.now().toString(),
      title,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      image,
      sizes,
      colors: Array.isArray(colors) ? colors : colors.split(',').map(c => c.trim()),
      description,
      inStock: Number(inStock),
      rating: 5.0,
      reviewsCount: 0,
      featured: false,
      salesCount: 0,
      specs: specs || { Material: "Premium Cotton Blend", Care: "Standard wash" }
    };

    products.push(newProduct);
    writeProducts(products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const products = readProducts();
    const idx = products.findIndex(p => p.id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const updatedProduct = {
      ...products[idx],
      ...req.body,
      price: req.body.price ? Number(req.body.price) : products[idx].price,
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : products[idx].originalPrice,
      inStock: req.body.inStock ? Number(req.body.inStock) : products[idx].inStock,
      colors: req.body.colors ? (Array.isArray(req.body.colors) ? req.body.colors : req.body.colors.split(',').map(c => c.trim())) : products[idx].colors
    };

    products[idx] = updatedProduct;
    writeProducts(products);

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    let products = readProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    products = products.filter(p => p.id !== req.params.id);
    writeProducts(products);
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:id/reviews
// @desc    Get reviews for a product
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const allReviews = readReviews();
    const productReviews = allReviews[req.params.id] || [];
    res.json(productReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Submit a review
// @access  Public
router.post('/:id/reviews', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    const productId = req.params.id;

    const allReviews = readReviews();
    if (!allReviews[productId]) allReviews[productId] = [];

    const newReview = {
      id: Date.now().toString(),
      productId,
      name,
      rating: Number(rating),
      comment,
      date: new Date().toLocaleDateString()
    };

    allReviews[productId].push(newReview);
    writeReviews(allReviews);

    // Recalculate average rating for product
    const productReviews = allReviews[productId];
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

    // Update product stats
    const products = readProducts();
    const idx = products.findIndex(p => p.id === productId);
    if (idx >= 0) {
      products[idx].rating = parseFloat(avgRating.toFixed(1));
      products[idx].reviewsCount = productReviews.length;
      writeProducts(products);
    }

    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
