const express = require('express');
const router = express.Router();
const Product = require('./models/product');
const mongoose = require('mongoose');
const product = require('./models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            if (docs.length >= 0) {
                const response = {
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: `http://localhost:3000/products/${doc._id}`
                            }
                        }
                    })
                };

                res.status(200).json(response);
            } else {
                res.status(404).json({message: 'No entries found'})
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product
        .save()
        .then((result) => {
            const createdProduct = {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/${result._id}`
                }
            };
            res.status(201).json({
                message: 'Created a new product',
                createdProduct: createdProduct
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
                createdProduct: null
            });
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all products',
                        url: 'http://localhost:3000/products'
                    }
                });
            } else {
                res.status(404).json({message: `No valid entry for provided ID ${id}`})
            }
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
});

router.patch('/:productId', (req, res, next) => {
    const productId = req.params.productId;
    Product.findByIdAndUpdate({_id: productId}, req.body, {returnDocument: 'after'})
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: 'Product updated',
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/products/${productId}`
                    }
                });
            } else {
                res.status(404).json({message: `No valid entry for provided ID ${productId}`})
            }
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

router.delete('/:productId', (req, res, next) => {
    Product.findByIdAndDelete({_id: req.params.productId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: {name: 'String', price: 'Number'}
                }
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
