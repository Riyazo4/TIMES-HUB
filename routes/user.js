var express = require("express");
var router = express.Router();
const userControllers = require("../controllers/userControllers");
const mongoose = require("mongoose");
// const { response } = require("../app");
const auth = require("../middlewares/middleware");
const userHelpers = require("../helpers/userHelpers");

/* GET home page. */
router.get("/",auth.user, userControllers.home);

// to get user login
router.get("/login", auth.user, userControllers.login);

//to post user login
router.post("/login", userControllers.postLogin);

//to get user signup
router.get("/signup", userControllers.signup);

//to post user singup
router.post("/signup", userControllers.postSignup);

// to get shop
router.get("/shop", auth.user, userControllers.shop);

// to get number
router.get("/getOtp", userControllers.getNumber);

//to post number
router.post("/postOtp", userControllers.postNumber);

//to get verify otp
router.get("/otpVerify", userControllers.verifyOtp);

// to post verify otp
router.post("/postOtpVerify", userControllers.postOtpVerify);

//to logout the user
router.get("/logout", auth.user, userControllers.logout);

// to get fullImage
router.get("/fullImage/:id", auth.user, userControllers.fullImage);

//to add products to cart
router.get("/addToCart/:id",auth.user, userControllers.addCart);

//to list items in cart
router.get("/cart",auth.user, userControllers.listCart);

// to changeQuantity of product
router.put("/changeQuantity",auth.user,userControllers.changeQuantity);

// to remove item from list
router.delete('/removeItem',auth.user,userControllers.removeItem);

// to placeOrder
router.get('/placeOrder',auth.user,userControllers.placeOrder)

// exports
module.exports = router;
