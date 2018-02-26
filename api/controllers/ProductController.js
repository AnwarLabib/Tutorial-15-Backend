const mongoose = require('mongoose'),
  moment = require('moment'),
  Validations = require('../utils/Validations'),
  Product = mongoose.model('Product');

module.exports.getProduct = async (req, res) => {
  if (!Validations.isObjectId(req.params.productId)) {
    return res.status(422).json({
      err: null,
      msg: 'productId parameter must be a valid ObjectId.',
      data: null
    });
  }
  const product = await Product.find({_id:req.params.productId,sellerName:req.user.username}).exec();
  if (!product) {
    return res
      .status(404)
      .json({ err: null, msg: 'Product not found.', data: null });
  }
  res.status(200).json({
    err: null,
    msg: 'Product retrieved successfully.',
    data: product
  });
};

module.exports.getProducts = async (req, res) => {
  const products = await Product.find({sellerName:req.user.username}).exec();
  res.status(200).json({
    err: null,
    msg: 'Products retrieved successfully.',
    data: products
  });
};

module.exports.getAllProducts = async (req, res) => {
  const products = await Product.find({}).exec();
  res.status(200).json({
    err: null,
    msg: 'Products retrieved successfully.',
    data: products
  });
};

module.exports.getProductsBelowPrice = async (req, res) => {
  const products = await Product.find({
    price: {
      $lt: req.params.price
    }
  }).exec();
  res.status(200).json({
    err: null,
    msg: 'Products priced below ' + req.params.price + ' retrieved successfully.',
    data: products
  });
};

module.exports.createProduct = async (req, res) => {
  const valid =
    req.body.name &&
    Validations.isString(req.body.name) &&
    req.body.price &&
    Validations.isNumber(req.body.price);
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'name(String) and price(Number) are required fields.',
      data: null
    });
  }
  // Security Check
  delete req.body.createdAt;
  delete req.body.updatedAt;

  var p = new Product({
    name : req.body.name,
    price : req.body.price,
    sellerName : req.user.username
  });

  const product = await Product.create(p);
  res.status(201).json({
    err: null,
    msg: 'Product was created successfully.',
    data: product
  });
};

module.exports.updateProduct = async (req, res) => {
  if (!Validations.isObjectId(req.params.productId)) {
    return res.status(422).json({
      err: null,
        msg: 'productId parameter must be a valid ObjectId.',
      data: null
    });
  }
  const valid =
    req.body.name &&
    Validations.isString(req.body.name) &&
    req.body.price &&
    Validations.isNumber(req.body.price);
  if (!valid) {
    return res.status(422).json({
      err: null,
      msg: 'name(String) and price(Number) are required fields.',
      data: null
    });
  }
  // Security Check
  delete req.body.createdAt;
  req.body.updatedAt = moment().toDate();

  const updatedProduct = await Product.findOneAndUpdate(
    {_id:req.params.productId,sellerName:req.user.username},
    {
      $set: req.body
    },
    { new: true }
  ).exec();
  if (!updatedProduct) {
    return res
      .status(404)
      .json({ err: null, msg: 'Product not found.', data: null });
  }
  res.status(200).json({
    err: null,
    msg: 'Product was updated successfully.',
    data: updatedProduct
  });
};

module.exports.deleteProduct = async (req, res) => {
  if (!Validations.isObjectId(req.params.productId)) {
    return res.status(422).json({
      err: null,
      msg: 'productId parameter must be a valid ObjectId.',
      data: null
    });
  }
  const deletedProduct = await Product.findOneAndRemove(
    {_id:req.params.productId,sellerName:req.user.username}).exec();
  if (!deletedProduct) {
    return res
      .status(404)
      .json({ err: null, msg: 'Product not found.', data: null });
  }
  res.status(200).json({
    err: null,
    msg: 'Product was deleted successfully.',
    data: deletedProduct
  });
};
