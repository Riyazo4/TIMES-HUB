var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const adminControllers = require("../controllers/adminController");
const multer = require("../multer/multer");
// const mongoose = require('mongoose');
const auth = require("../middlewares/middleware");

// router.use(auth.admin)

//admin home
router.get("/", auth.admin, adminControllers.adminHome);

//admin dashboard
router.get("/dashboard", auth.admin, adminControllers.dashboard);

//admin login
router.get("/adminLogin", auth.admin, adminControllers.adminLogin);

//post admin login
router.post("/adminLogin", adminControllers.postAdminLogin);

//add product
router.get("/addProduct", auth.admin, adminControllers.addProduct);

//post add product
router.post("/addProduct", multer.uploads, adminControllers.postAddProduct);

// add category
router.get("/addCategory", auth.admin, adminControllers.addCategory);

//post add category
router.post("/addCategory", adminControllers.postCategory);

// add sub Category
router.get("/addSub", auth.admin, adminControllers.addSub);

// view users
router.get("/users", auth.admin, adminControllers.addUsers);

// view admin added products
router.get("/products", auth.admin, adminControllers.getProducts);

// delete a product
router.get("/deleteProduct/:id", auth.admin, adminControllers.deleteProduct);

// delete category
router.get("/deleteCategory/:id", auth.admin, adminControllers.deleteCategory);

// to block user
router.get("/blockUser/:id", auth.admin, adminControllers.blockUser);

// to unblock user
router.get("/unBlockUser/:id", auth.admin, adminControllers.unBlock);

// to get edit product
router.get("/getEditProduct/:id", auth.admin, adminControllers.getEditProduct);

//to post edit product
router.post(
  "/postEditProduct/:id",
  multer.uploads,
  adminControllers.postEditProduct
);

// to get edit category
router.get(
  "/getEditCategory/:id",
  auth.admin,
  adminControllers.getEditCategory
);

// to post edit category
router.post("/postEditCategory/:id", adminControllers.postEditCategory);

// to logout admin
router.get("/adminLogout", auth.admin, adminControllers.adminLogout);

// to exports router
module.exports = router;
