const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');
const OrderController = require('../middleware/controllers/orders');

router.get('/', checkAuth, OrderController.get_all_orders);

router.get('/:orderId', OrderController.get_order);

router.post('/', checkAuth, OrderController.create_new_order);

router.patch('/:orderId', checkAuth, OrderController.update_order);

router.delete('/:orderId', checkAuth, OrderController.delete_order);

module.exports = router;
