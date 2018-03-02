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

module.exports.getCart = async (req, res) => { //gets all items in cart of logged in user
    var user = req.user;
  const products = await Product.find(
  {
    addedInCarts: {
      $elemMatch: {
        _id: user._id.toString()
      }
    }
  }).exec();

  res.status(200).json({
    err: null,
    msg: 'Products retrieved successfully.',
    data: products
  });
};

module.exports.removeFromCart = async (req, res) => {
  var user = req.user;

  const removedFromCart = await Product.update({_id:req.params.productId},{
      $pull : {
          addedInCarts: {
              _id: user._id.toString()
          }
      }
  }).exec();

  if (!removedFromCart) { //unnecessary check
    return res
      .status(404)
      .json({ err: null, msg: 'Product not found.', data: null });
  }

  res.status(200).json({ //if nModifed: 0 in the respond, ya3ny kda hwa mafeesh asln item fl cart hwa 7awel yemsa7.. remove it from front end b2a aw refresh his page
    err: null,
    msg: 'Products removed from cart',
    data: removedFromCart
  });
};

module.exports.clearCart = async (req, res) => {
   var user = req.user;

   const removedFromCart = await Product.updateMany({
     addedInCarts: {
       _id: user._id.toString()
   }},{
       $pull : {
           addedInCarts: {
               _id: user._id.toString()
           }
       }
   }).exec();

   if (!removedFromCart) { //unnecessary check
     return res
       .status(404)
       .json({ err: null, msg: 'Product not found.', data: null });
   }

   res.status(200).json({ //if nModifed: 0 in the respond, ya3ny kda hwa mafeesh asln item fl cart hwa 7awel yemsa7.. remove it from front end b2a aw refresh his page
     err: null,
     msg: 'Products removed from cart',
     data: removedFromCart
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


module.exports.addToCart = async (req, res) => {
  var user = req.user;
  // console.log(req.params.productId); //correct
  // console.log(user._id); //correct

  if (!Validations.isObjectId(req.params.productId)) {
    return res.status(422).json({
      err: null,
        msg: 'productId parameter must be a valid ObjectId.',
      data: null
    });
  }

  // Security Check
  delete req.body.createdAt;
  req.body.updatedAt = moment().toDate();


  //now add the user id to the array of addedToCart in the product itself
  var addedNameToCart = await Product.update(
    {_id: req.params.productId},
    {
      $push: { addedInCarts: {
        _id: user._id
      }}
    }).exec();
//  console.log(product);



  //check if it has updated the product, if not, yob2a hwa mal2ahosh fa send 404 not found
  if (!addedNameToCart) {
    return res
      .status(404)
      .json({ err: null, msg: 'Product not found.', data: null });
  }
  //send the success status code and message
  return res.status(200).json({
    err: null,
    msg: 'Product was added to cart successfully.',
    data: addedNameToCart
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
