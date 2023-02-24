module.exports = {
  user: (req, res, next) => {
    if (req.session.userLoggedIn) {
      next();
    } else {
      res.render("user/login");
    }
  },
  admin: (req, res, next) => {
    if (req.session.adminLogIn) {
      next();
    } else {
      res.render("admin/adminLogin", { layout: "adminLayout" });
    }
  },
  // otp:(req,res,next)=>{
  //     if(req.session.userLoggedIn){
  //         next()
  //     }else{
  //         res.render('user/otp')
  //     }
  // }
};
