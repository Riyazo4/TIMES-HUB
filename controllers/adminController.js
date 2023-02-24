const { json } = require("express");
const { response } = require("../app");
const adminHelpers = require("../helpers/adminHelpers");
const users = require("../models/connection");

let adminCredentials = {
  // name: "Smith",
  email: "mohammedriyazriyaz04@gmail.com",
  password: 123,
};

module.exports = {
  adminLogin: (req, res) => {
    if (req.session.adminLogIn) {
      res.render("admin/admin-dashboard", { layout: "adminLayout" });
    } else {
      // let hideHeader = true
      res.render("admin/adminLogin", { layout: "adminLayout" });
    }
  },
  postAdminLogin: (req, res) => {
    if (
      req.session.adminLogIn ||
      (req.body.email == adminCredentials.email &&
        req.body.password == adminCredentials.password)
    ) {
      // let admins = req.session.admin
      req.session.adminLogIn = true;
      req.session.admin = adminCredentials;

      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/admin/adminLogin");
    }
  },
  adminHome: (req, res) => {
    if (req.session.adminLogIn) {
      let admins = req.session.admin;
      res.render("admin/admin-dashboard", { layout: "adminLayout", admins });
    } else {
      res.redirect("/admin/adminLogin");
    }
  },
  addProduct:  (req, res) => {
    if (req.session.adminLogIn) {
      admins = req.session.admin;
     adminHelpers.getCategory().then((data)=>{
       res.render("admin/add-product", { layout: "adminLayout", admins ,data});
     })
    } else {
      res.redirect("/admin/adminLogin");
    }
  },
  postAddProduct: (req, res) => {
    console.log(req.body);
    adminHelpers
      .postAddProduct(req.body, req.file.filename)
      .then((productData) => {
        res.redirect("/admin/products");
      });
  },
  addCategory: (req, res) => {
    if (req.session.adminLogIn) {
      admins = req.session.admin;
      adminHelpers.getCategory().then((data) => {
        res.render("admin/add-category", {
          layout: "adminLayout",
          data,
          admins,
        });
      });
    } else {
      res.redirect("/admin/adminLogin");
    }
  },
  postCategory: (req, res) => {
    adminHelpers.postCategory(req.body).then((data) => {
      res.redirect("/admin/addCategory");
    });
  },
  addSub: (req, res) => {
    if (req.session.adminLogIn) {
      admins = req.session.admin;
      res.render("admin/add-subcategory", { layout: "adminLayout", admins });
    }
  },
  addUsers: (req, res) => {
    if (req.session.adminLogIn) {
      admins = req.session.admin;
      adminHelpers.getUsers().then((data) => {
        console.log(data);
        res.render("admin/add-users", { layout: "adminLayout", data, admins });
      });
    } else {
      res.redirect("/admin/adminLogin");
    }
  },
  getProducts: (req, res) => {
    if (req.session.adminLogIn) {
      admins = req.session.admin;
      adminHelpers.getProducts().then((productData) => {
        console.log(productData);
        res.render("admin/view-products", {
          layout: "adminLayout",
          productData,
          admins,
        });
        // res.redirect('/admin/products')
      });
    } else {
      res.redirect("/admin/adminLogin");
    }
  },
  dashboard: (req, res) => {
    let admins = req.session.admin;
    res.render("admin/admin-dashboard", { layout: "adminLayout", admins });
  },
  deleteProduct: (req, res) => {
    let userId = req.params.id;
    adminHelpers.deleteProduct(userId).then(() => {
      res.redirect("/admin/products");
    });
  },
  deleteCategory: (req, res) => {
    let categoryId = req.params.id;
    adminHelpers.deleteCategory(categoryId).then((response) => {
      res.redirect("/admin/addCategory");
    });
  },
  blockUser: (req, res) => {
    let blockUser = req.params.id;
    adminHelpers.blockUser(blockUser).then((data) => {
      res.redirect("/admin/users");
    });
  },
  unBlock: (req, res) => {
    let unBlock = req.params.id;
    adminHelpers.unBlock(unBlock).then((data) => {
      res.redirect("/admin/users");
    });
  },
  getEditProduct: (req, res) => {
    if (req.session.adminLogIn) {
      admins = req.session.admin;
      adminHelpers.editProduct(req.params.id).then((data) => {
        // console.log(data);
        res.render("admin/editProduct", {
          layout: "adminLayout",
          data,
          admins,
        });
      });
    } else {
      res.redirect("/admin/adminLogin");
    }
  },
  postEditProduct: (req, res) => {
    adminHelpers
      .postEditProduct(req.params.id, req?.file?.filename, req.body)
      .then((data) => {
        console.log(data);
        res.redirect("/admin/products");
      });
  },
  getEditCategory: (req, res) => {
    if (req.session.adminLogIn) {
      admins = req.session.admin;
      adminHelpers.editCategory(req.params.id).then((response) => {
        res.render("admin/editCategory", {
          layout: "adminLayout",
          response,
          admins,
        });
      });
    } else {
      res.redirect("/admin/adminLogin");
    }
  },
  postEditCategory: (req, res) => {
    adminHelpers.postEditCategory(req.params.id, req.body).then((data) => {
      console.log(data);
      res.redirect("/admin/addCategory");
    });
  },
  adminLogout: (req, res) => {
    req.session.adminLogIn = false;
    res.redirect("/admin");
  },
};
