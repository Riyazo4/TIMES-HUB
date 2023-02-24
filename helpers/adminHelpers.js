const user = require("../models/connection");
const product = require("../models/connection");
const multer = require("multer");
const filename = require("../multer/multer");

const category = require("../models/connection");
// const { addCategory } = require('../controllers/adminController');
// const { response } = require('../app');
const session = require("express-session");

module.exports = {
  getUsers: () => {
    return new Promise(async (resolve, reject) => {
      let userData = [];
      await user.users
        .find()
        .exec()
        .then((result) => {
          userData = result;
        });
      // console.log(userData);
      resolve(userData);
    });
  },

  postAddProduct: (productData, filename) => {
    return new Promise(async (resolve, reject) => {
      let addProduct = new product.product({
        ProductName: productData.name,
        Quantity: productData.quantity,
        Price: productData.price,
        Category: productData.category,
        Image: filename,
      });
      await addProduct.save().then((productData) => {
        resolve(productData);
      });
    });
  },
  getProducts: () => {
    return new Promise(async (resolve, reject) => {
      let proData = [];
      await product.product
        .find()
        .exec()
        .then((productData) => {
          proData = productData;
        });
      // console.log(proData);
      resolve(proData);
    });
  },
  deleteProduct: (userId) => {
    return new Promise(async (resolve, reject) => {
      await product.product.deleteOne({ _id: userId }).then((response) => {
        resolve(response);
      });
    });
  },
  postCategory: (data) => {
    return new Promise(async (resolve, reject) => {
      let addCategory = new category.category({
        name: data.name,
      });
      await addCategory.save().then((categoryData) => {
        console.log(addCategory);
        resolve(categoryData);
      });
    });
  },
  getCategory: () => {
    return new Promise(async (resolve, reject) => {
      let categoryData = [];
      await category.category
        .find()
        .exec()
        .then((data) => {
          categoryData = data;
        });
      resolve(categoryData);
    });
  },
  deleteCategory: (categoryId) => {
    return new Promise(async (resolve, reject) => {
      await category.category
        .deleteOne({ _id: categoryId })
        .then((response) => {
          resolve(response);
        });
    });
  },
  blockUser: (blockedUser) => {
    console.log(blockedUser);
    return new Promise(async (resolve, reject) => {
      await user.users
        .updateOne({ _id: blockedUser }, { $set: { blocked: true } })
        .then((response) => {
          resolve(response);
        });
    });
  },
  unBlock: (unBlock) => {
    return new Promise(async (resolve, reject) => {
      await user.users
        .updateOne({ _id: unBlock }, { $set: { blocked: false } })
        .then((response) => {
          resolve(response);
          console.log("HEllo");
        });
    });
  },
  editProduct: (prodId) => {
    return new Promise(async (resolve, reject) => {
      await user.product
        .findOne({ _id: prodId })
        .exec()
        .then((data) => {
          resolve(data);
          // console.log(data);
        });
    });
  },
  postEditProduct: (productData, filename, bodyData) => {
    return new Promise(async (resolve, reject) => {
      await user.product
        .updateOne(
          { _id: productData },
          {
            $set: {
              ProductName: bodyData.name,
              Price: bodyData.price,
              Category: bodyData.category,
              Image: filename,
            },
          }
        )
        .then((data) => {
          console.log(data);
          resolve(data);
        });
    });
  },
  editCategory: (categoryId) => {
    return new Promise(async (resolve, reject) => {
      await user.category
        .findOne({ _id: categoryId })
        .exec()
        .then((data) => {
          resolve(data);
        });
    });
  },
  postEditCategory: (categoryId, bodyCategory) => {
    return new Promise(async (resolve, reject) => {
      await user.category
        .updateOne(
          { _id: categoryId },
          {
            $set: {
              name: bodyCategory.name,
            },
          }
        )
        .then((data) => {
          resolve(data);
        });
    });
  },
};
