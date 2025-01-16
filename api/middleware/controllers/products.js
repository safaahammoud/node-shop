
const Order = require('../../models/order');
const Product = require('../../models/product');

exports.get_all_products = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            if (docs.length >= 0) {
                const response = {
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            productImage: doc.productImage,
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
}
exports.get_product = (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select('name price _id productImage')
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
}
exports.create_new_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
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
}

exports.update_product = (req, res, next) => {
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
}

exports.delete_product = (req, res, next) => {
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
}