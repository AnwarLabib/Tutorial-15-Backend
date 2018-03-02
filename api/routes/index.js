const express = require('express'),
  router = express.Router(),
  asyncMiddleware = require('express-async-handler'),
  productCtrl = require('../controllers/ProductController');
  userCtrl = require('../controllers/UserController');
  var {authenticate} = require('./../middleware/authenticate');


//-------------------------------Product Routes-----------------------------------
router.get('/product/getProducts',authenticate, asyncMiddleware(productCtrl.getProducts)); //gets products created by this user
router.get('/product/getAllProducts', asyncMiddleware(productCtrl.getAllProducts)); //get all products in the db
router.get('/product/getProduct/:productId',authenticate, asyncMiddleware(productCtrl.getProduct)); //get products by ID
router.get(
  '/product/getProductsBelowPrice/:price',authenticate,
  asyncMiddleware(productCtrl.getProductsBelowPrice)
);
router.post('/product/createProduct',authenticate, asyncMiddleware(productCtrl.createProduct));
router.patch('/product/addToCart/:productId',authenticate, asyncMiddleware(productCtrl.addToCart));
router.get('/product/getCart',authenticate, asyncMiddleware(productCtrl.getCart)); //get all products in cart of a specific user
router.delete('/product/removeFromCart/:productId',authenticate, asyncMiddleware(productCtrl.removeFromCart));
router.patch('/product/updateProduct/:productId',authenticate, asyncMiddleware(productCtrl.updateProduct));
router.delete('/product/deleteProduct/:productId',authenticate, asyncMiddleware(productCtrl.deleteProduct));
router.delete('/product/clearCart',authenticate, asyncMiddleware(productCtrl.clearCart));

router.post('/user/createUser',userCtrl.createUser);
router.post('/user/loginUser', userCtrl.loginUser);
router.delete('/user/deleteUser',authenticate,userCtrl.deleteUser);
module.exports = router;
