const mongoose = require("mongoose");
const { resolve } = require("path");
const { response } = require("../app");

let userHelpers = require("../helpers/userHelpers");

const schema = require("../models/connection");
let otp = require("../otp/otp");
let client = require("twilio")(otp.accountSID, otp.authToken);

let userLoggedIn;
var mobileNumber;

module.exports = {
  login: (req, res) => {
    if (req.session.userLoggedIn) {
      res.redirect("/");
    } else {
      res.render("user/login");
    }
  },
  postLogin: (req, res) => {
    userHelpers.doLogin(req.body).then((response) => {
      req.session.userLoggedIn = true;
      req.session.user = response;
      let loggedinstatus = response.loggedinstatus;
      let blockedStatus = response.blockedStatus;

      if (loggedinstatus == true) {
        res.redirect("/");
      } else {
        res.render("user/login", {
          block: blockedStatus,
          logged: loggedinstatus,
        });
      }
    });
  },
  home: async (req, res) => {
    await userHelpers.getProducts().then(async (data) => {
      if (req.session.userLoggedIn) {
        let user = req.session.user;
        let count = await userHelpers.getCount(req.session.user.id);
        console.log(data);
        res.render("user/user", { data, user, count });
      } else {
        res.render("user/user");
      }
    });
  },
  shop: (req, res) => {
    if (req.session.userLoggedIn) {
      userHelpers.getProducts().then(async (data) => {
        user = req.session.user;
        let count = await userHelpers.getCount(req.session.user.id);
        // id  = req.session.user
        res.render("user/shop", { data, user, count });
      });
    } else {
      res.redirect("/login");
    }
  },

  signup: (req, res) => {
    emailStatus = true;
    user = req.session.user;
    res.render("user/signup", { emailStatus, user });
  },
  postSignup: (req, res) => {
    userHelpers.doSignUp(req.body).then((response) => {
      console.log(response);
      var emailStatus = response.status;
      if (emailStatus == false) {
        res.render("user/signup", { emailStatus });
      } else {
        res.redirect("/login");
      }
    });
  },
  logout: (req, res) => {
    req.session.userLoggedIn = false;
    res.redirect("/login");
  },
  getNumber: (req, res) => {
    res.render("user/otpNumber");
  },
  postNumber: async (req, res) => {
    mobileNumber = req.body.number;
    console.log(mobileNumber);
    let users = await schema.users.find({ phoneNo: mobileNumber }).exec();
    console.log(users);
    if (users == false) {
      res.render("user/otpNumber", { userExist: true });
    } else {
      console.log("hello");
      client.verify.v2
        .services(otp.serviceId)
        .verifications.create({ to: `+91 ${mobileNumber}`, channel: "sms" })
        .then(() => {
          req.session.userLoggedIn = true;
          let readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
          });
        });
    }
    // req.session.userLoggedIn = true
    res.render("user/otp");
  },

  verifyOtp: (req, res) => {
    // user = req.session.user
    if (req.session.userLoggedIn) {
      res.redirect("/");
    } else {
      res.render("user/otp", { user });
    }
  },

  postOtpVerify: async (req, res) => {
    let otpNumber = req.body.otp;
    console.log(otpNumber);
    console.log(mobileNumber);
    await client.verify.v2
      .services(otp.serviceId)
      .verificationChecks.create({ to: `+91 ${mobileNumber}`, code: otpNumber })
      .then((verificationChecks) => {
        console.log(verificationChecks);
        if (verificationChecks.valid) {
          // req.session.user = user
          user = req.session.user;
          req.session.userLoggedIn = true;
          console.log("enter");
          res.redirect("/");
        } else {
          console.log("no entry");
          res.render("user/otp", { invalidOtp: true });
        }
      });
  },
  getCart: async (req, res) => {
    if (req.session.userLoggedIn) {
      user = req.session.user;

      res.render("user/cart", { user });
    } else {
      res.redirect("/login");
    }
  },
  fullImage: (req, res) => {
    userHelpers.fullView(req.params.id).then(async (data) => {
      user = req.session.user;
      let count = await userHelpers.getCount(req.session.user.id);
      let Image = data[0];
      res.render("user/productfull", { Image, user, count });
    });
  },
  addCart: (req, res) => {
    // console.log(req.params.id,req.session.user);
    // console.log('Api Called ajax')
    console.log(req.session.user.id);
    userHelpers.addCart(req.params.id, req.session.user.id).then((response) => {
      console.log(response);
      res.json({ status: true });
    });
  },
  listCart: async (req, res) => {
    // console.log(req);
    // console.log(req.session.user.id);
    user = req.session.user;
    
      userHelpers.listToCart(req.session.user.id).then(async (cartItems) => {
      let total = await userHelpers.getTotal(req.session.user.id);
      let count = await userHelpers.getCount(req.session.user.id);
     console.log(cartItems+"New");
      //  let subTotal = await userHelpers.subTotal(req.session.user.id);
      //  console.log(subTotal+"riiutrthiuh");
     //  console.log(total+'totallllll');
     res.render("user/cart", { cartItems, user, count ,total});
    });
  },
  changeQuantity: (req, res) => {
    console.log("Api Call");
    console.log(req.body);
    userHelpers.changeQuantity(req.body).then(async(response) => {
      response.total = await userHelpers.getTotal(req.session.user.id);
      // response.subTotal = await userHelpers.subTotal(req.session.user.id)
      // console.log(response.subTotal,"Subtotalrhkfjgkjg");
      // console.log(response.subTotal,"kjfgkj");
      res.json(response);
    });
  },
  removeItem: (req, res) => {
    // console.log(req.body);
    userHelpers.removeItem(req.body).then((response) => {
      res.json(response);
    });
  },
  placeOrder:async(req,res)=>{
    user = req.session.user
    total = await userHelpers.getTotal(req.session.user.id);
    res.render('user/order',{user,total})
  }
};
