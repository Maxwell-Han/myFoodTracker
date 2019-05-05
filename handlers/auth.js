const db = require('../models')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
exports.signup = function(req, res, next) {
  req.body.email
  req.body.password
  User.register(new User({username: req.body.email}), req.body.password, function(err, user){
    console.log(req.body.email, req.body.password)
    if(err){
      console.log(err)
      return res.render('signup')
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/secret')
    })
  })
}

exports.signin = async function(req, res, next){
  try {
    let user = await db.User.findOne({
      email: req.body.email
    })
    let { id, email } = user
    let isMatch = await user.comparePassword(req.body.password)
    if(isMatch) {
      let token = jwt.sign(
        {
          id: id,
          email: email
        }, process.env.SECRET_KEY
      )
      return res.status(200).json({
        id: id,
        email: email,
        token: token
      })
    } else {
      return next({
        status: 400,
        message: "Invalid email or password"
      })
    }
  } catch(err) {
    return next({ status: 400, message: "Invalid email or password" })
  }
}
