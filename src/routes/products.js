const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Protected routes (admin only)
router.post('/', auth, upload.array('images', 10), createProduct);
router.put('/:id', auth, upload.array('images', 10), updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router; 