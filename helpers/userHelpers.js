var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
let users = require("../models/connection");
let product = require("../models/connection");
let session = require("express-session");
let cart = require("../models/connection");
const { user } = require("../middlewares/middleware");
const { response } = require("../app");
// const { user } = require("../middlewares/middleware");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  doSignUp: (userData) => {
    let emailStatus = {};
    return new Promise(async (resolve, reject) => {
      try {
        email = userData.email;
        existingUser = await users.users.findOne({ email });
        if (existingUser) {
          emailStatus = { status: false };
          resolve(emailStatus);
        } else {
          let hashPassword = await bcrypt.hash(userData.password, 12);

          let newUser = users.users({
            name: userData.username,
            email: userData.email,
            phoneNo: userData.number,
            password: hashPassword,
          });
          await newUser.save(newUser).then((data) => {
            resolve({ data, status: true });
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
  },
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {};
        let user = await users.users.findOne({ email: userData.email });
        // console.log(user);
        if (user) {
          console.log(user.blocked);
          if (user.blocked == false) {
            await bcrypt
              .compare(userData.password, user.password)
              .then((status) => {
                console.log(status);
                if (status) {
                  console.log(user.name);
                  userName = user.name;
                  id = user._id;
                  resolve({ response, loggedinstatus: true, userName, id });
                  console.log(userName);
                } else {
                  resolve({ loggedinstatus: false });
                }
              });
          } else {
            resolve({ blockedStatus: true });
          }
        } else {
          resolve({ loggedinstatus: false });
        }
      } catch (err) {
        console.log(err);
      }
    });
  },
  getProducts: () => {
    return new Promise(async (resolve, reject) => {
      let getProduct = [];
      await product.product.find({}).then((data) => {
        getProduct = data;
      });
      resolve(getProduct);
    });
  },
  fullView: (data) => {
    return new Promise(async (resolve, reject) => {
      await product.product.find({ _id: data }).then((response) => {
        resolve(response);
      });
    });
  },
  addCart: (proId, userId) => {

    let objCart = {
      productId: proId,
      quantity: 1,
    }
    console.log(userId);
    return new Promise(async (resolve, reject) => {
      let carts = await users.cart.findOne({ user: userId });
      console.log(carts);
     if (carts) {
        let productExist = carts.cartItems.findIndex(
          (cartItems) => cartItems.productId == proId
        );
        console.log(productExist);
        if (productExist != -1) {
          console.log(productExist);
          users.cart
            .updateOne(
              { user: userId, "cartItems.productId": proId },
              { $inc: { "cartItems.$.Quantity": 1 } }
            )
            .then((response) => {
              console.log(response);
              resolve({ response, status: false });
            });
        } else {
          await users.cart
            .updateOne(
              { user: userId },
              {
                $push: {
                  cartItems: objCart,
                },
              }
            )
            .then((response) => {
              resolve({ response, status: true });
            });
        }
      } else {
        let cartItems = new users.cart({
          user: userId,
          cartItems: objCart,
        });
        console.log(cartItems);
        await cartItems.save().then(() => {
          resolve({ status: true });
        });
      }
    });
  },
  listToCart: (userId) => {
    // console.log(userId+"   89498498");
    return new Promise(async (resolve, reject) => {
       await users.cart
        .aggregate([
          {
            $match: {
              user: ObjectId(userId),
            },
          },
          {
            $unwind: "$cartItems",
          },
          {
            $project: {
              item: "$cartItems.productId",
              quantity: "$cartItems.Quantity",
              _id: "$cartItems._id",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "item",
              foreignField: "_id",
              as: "carted",
            }
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              carted: { $arrayElemAt: ["$carted", 0] },
            },
          },
        ])
        .then((cartItems) => {
          console.log(cartItems,"cartItems");
          resolve(cartItems);
        });
    });
  },
  getCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await users.cart.findOne({ user: userId });
      if (cart) {
        count = cart.cartItems.length;
      }
      resolve(count);
    });
  },
  totalAmount: (userId) => {
    return new Promise((resolve, reject) => {});
  },
  removeItem: (data) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
      await users.cart
        .updateOne(
          { user: data.user },
          { $pull: { cartItems: { productId: data.product } } }
        )
        .then((response) => {
          console.log("hej", response);
          resolve({ removeProduct: true });
        });
    });
  },
  changeQuantity: async (data) => {
    console.log(data,"data");
    count = parseInt(data.count);
    quantity = parseInt(data.quantity);
    return new Promise(async (resolve, reject) => {
      if (count == -1 && data.Quantity == 1) {
        await users.cart
          .updateOne(
            { user: data.user },
            { $pull: { cartItems: { productId: data.product } } }
          )
          .then((response) => {
            resolve({ removeProduct: true });
          });
      } else {
        await users.cart
          .updateOne(
            { user: data.user, "cartItems.productId": data.product },
            { $inc: { "cartItems.$.Quantity": count } }
          )
          .then((response) => {
            resolve({status:true});
          });
      }
    });
  },
    getTotal:(user)=>{
    return new Promise(async(resolve,reject)=>{

    let total = await users.cart.aggregate([
       {
        $match:{
          user:ObjectId(user)
        }
       },
       {
        $unwind:'$cartItems'
       },
          {
            $project:{
              item:'$cartItems.productId',
               quantity:'$cartItems.Quantity',
               _id:'$cartItems._id'
            }
          },
          {
            $lookup:{
              from:'products',
              localField:'item',
              foreignField:'_id',
              as:'carted'
            }
          },
          {
            $project:{
              item:1,quantity:1,product:{$arrayElemAt:['$carted',0]}
            }
          },
          {
            $group:{
              _id:null,
              total:{$sum:{$multiply:['$quantity','$product.Price']}}
            }
          }

    ]).then((total)=>{
      console.log(total[0]?.total+" total");
      resolve(total[0]?.total)
    })
  })
    
  },
  // subTotal:(userId)=>{
  //   return new Promise (async(resolve,reject)=>{
  //     let subTotal = await users.cart.aggregate([
  //       {
  //       $match:{
  //         user:ObjectId(userId)
  //       }
  //       },
  //       {
  //         $unwind:'$cartItems'
  //       },
  //       {
  //         $project:{
  //           item:'$cartItems.productId',
  //           quantity:'$cartItems.Quantity',
  //         }
  //       },
  //       {
  //         $lookup:{
  //           from:'products',
  //           localField:'item',
  //           foreignField:'_id',
  //           as:'carted'
  //         }
  //       },
  //       {
  //         $project:{
  //           item:1,
  //           quantity:1,price:{$arrayElemAt:['$carted.Price',0]}
  //         }
  //       },
  //       {
  //         $project:{
  //           subTotal:{$multiply:['$quantity','$price']}}
  //         }
  //    ]).then((subTotal)=>{
  //     console.log(subTotal,"Subtotal");
  //     resolve(subTotal)
  //    })
        
  //   })
  // }
};
