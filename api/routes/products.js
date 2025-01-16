const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../middleware/controllers/products');
const { delete_order } = require('../middleware/controllers/orders');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Incorrect file type only accepts png or jpeg'), false);
    }
}
const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter
});

router.get('/', ProductController.get_all_products);

router.post('/', checkAuth, upload.single('productImage'), ProductController.create_new_product);

router.get('/:productId', ProductController.get_product);

router.patch('/:productId', checkAuth, ProductController.update_product);

router.delete('/:productId', checkAuth, ProductController.delete_product);

module.exports = router;
