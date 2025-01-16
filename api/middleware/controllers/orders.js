
const Order = require('../../models/order');
const Product = require('../../models/product');

exports.get_all_orders = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            if (docs.length >= 0) {
                res.status(200).json({
                    count: docs.length,
                    orders: docs.map(doc => {
                        return {
                            _id: doc._id,
                            product: doc.product,
                            quantity: doc.quantity,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orders/' + doc._id
                            }
                        }
                    })
                });
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

exports.get_order = (req, res, next) => {
    const id = req.params.orderId;
    
    Order.findById(id)
        .populate('product')
        .exec()
        .then(order => {
            if (order) {
                res.status(200).json({
                    order,
                    request: {
                        type: 'GET',
                        description: 'Get all orders',
                        url: 'http://localhost:3000/orders'
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

exports.create_new_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            
            return order.save();
        }).then(result => {
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_order = (req, res, next) => {
     res.status(200).json({
        message: 'Order was updated'
    });
}

exports.delete_order = (req, res, next) => {
    Order.findByIdAndDelete({_id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: {productId: 'ID', quantity: 'Number'}
                }
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}