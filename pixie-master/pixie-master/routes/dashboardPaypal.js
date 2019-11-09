var express = require('express');
var router = express.Router();

var UserOnBoardingDetail = require('../models/userOnboardingDetails');
var Orders = require('../models/orders');

/* Create product. */
router.post('m/mmm', function(req, res, next) {
  // Product.create({
  //   name: req.body.name,
  //   amount: req.body.amount,
  //   description: req.body.description,
  //   quantity: req.body.quantity,
  //   product_image_number: req.body.product_image_number,
  //   seller: req.body.seller
  // }, function(err, product) {
  //   if (err) return next(err);
  //   return res.redirect('/dashboard');
  // });
});

/* GET User OnBoarding details. */
router.get('/OnboardingDetail/:sellerId', function(req, res, next) {
  UserOnBoardingDetail.findOne({seller: req.params.sellerId}, function(err, userOnBoardingDetail) {
    console.log("userOnBoardingDetail: ", userOnBoardingDetail);
    if (err) {
      // Handle the case where the id cannot be cast to an Object ID.
      res.render('userOnBoardingDetail');
    } else {
      if (userOnBoardingDetail) {
        res.send(userOnBoardingDetail);
      }
      else{
        res.send({});
      }
    }
  });
});


router.post('/Onboarding:id', function(req, res, next) {
  console.log('update listing');
  UserOnBoardingDetail.updateOne(
    { _id: req.params.id },
    { $set: req.body },
  function(err, onBoarding) {
    if (err) return next(err);
    //res.redirect('/dashboard');
  });
});

router.post('/Onboarding:id', function(req, res, next) {
  console.log('update listing');
  UserOnBoardingDetail.updateOne(
    { _id: req.params.id },
    { $set: req.body },
  function(err, onBoarding) {
    if (err) return next(err);
    //res.redirect('/dashboard');
  });
});

router.post('/saveOnboarding', function(req, res, next) {
  console.log('save onboarding');

  UserOnBoardingDetail.updateOne(
    { seller: req.body.seller },
    { 
      merchantId: req.body.merchantid,
      merchantIdInPayPal: req.body.merchantidinpaypal,
      permissionsGranted: req.body.permissionsgranted,
      accountStatus: req.body.accountstatus,
      consentStatus: req.body.consentstatus,
      productIntentID: req.body.productintentid,
      isEmailConfirmed: req.body.isemailconfirmed,
      returnMessage: req.body.returnmessage,
      seller: req.body.seller
    },
    { upsert : true },  function(err, userOnBoardingDetail) {
          console.log("userOnBoardingDetail: ", userOnBoardingDetail);
          if (err) return next(err);
            return res.send('1');
    });
});

router.post('/create-order', function(req, res, next) {
  console.log('save onboarding');
  console.log('req.body: ', req.body);

  Orders.create(
    { 
      merchantId: req.body.merchantid,
      quantity: req.body.quantity,
      customer: req.body.customer,    
      product: req.body.productid,
      seller: req.body.seller
    },  function(err, order) {
          console.log("order: ", order);
          if (err) return next(err);
            return res.send(order._id);
    });
});

router.post('/handle-approve:orderId', function(req, res, next) {
  console.log('handle approve');
  console.log('req.body: ', req.body);
  console.log("order id: ", req.params.orderId)
});

module.exports = router;