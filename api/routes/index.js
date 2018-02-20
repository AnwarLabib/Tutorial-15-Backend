const express = require('express'),
  router = express.Router(),
  asyncMiddleware = require('express-async-handler'),
  productCtrl = require('../controllers/ProductController');
  userCtrl = require('../controllers/UserController');
  var {authenticate} = require('./../middleware/authenticate');


//-------------------------------Product Routes-----------------------------------
router.get('/product/getProducts',authenticate, asyncMiddleware(productCtrl.getProducts));
router.get('/product/getProduct/:productId',authenticate, asyncMiddleware(productCtrl.getProduct));
router.get(
  '/product/getProductsBelowPrice/:price',authenticate,
  asyncMiddleware(productCtrl.getProductsBelowPrice)
);
router.post('/product/createProduct',authenticate, asyncMiddleware(productCtrl.createProduct));
router.patch('/product/updateProduct/:productId',authenticate, asyncMiddleware(productCtrl.updateProduct));
router.delete('/product/deleteProduct/:productId',authenticate, asyncMiddleware(productCtrl.deleteProduct));

router.post('/user/createUser',userCtrl.createUser);
router.post('/user/loginUser', userCtrl.loginUser);
router.delete('/user/deleteUser',authenticate,userCtrl.deleteUser);
module.exports = router;
