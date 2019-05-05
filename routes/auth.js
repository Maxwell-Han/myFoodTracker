var express = require('express');
var router = express.Router();
var passport = require('passport')
var Entry = require('../models/entry')
var User = require('../models/user')
var middleware = require("../middleware/auth")
// const { signup, signin } = require('../handlers/auth')
//
// router.post('/signup', signup)
// router.post('/signin', signin)
// module.exports = router


router.get('/signup',function(req, res) {
  res.render('signup')
})

router.get('/secret', middleware.isLoggedIn, function(req, res) {
  User.find({}, function(err, allUsers) {
    if(err) {
      console.log(err)
    } else {
      res.render('./secret', {users: allUsers})
    }
  })
  // res.render('secret')
})

router.post('/signup', function(req, res, next) {
  User.register(new User({username: req.body.username}),
    req.body.password,
    function(err, user){
      if(err){
        console.log(err)
        return res.render('signup')
      }
      passport.authenticate('local')(req, res, function() {
        res.redirect('secret')
    })
  })
})

router.get('/login', function(req, res) {
  res.render('login')
})

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/login'}),
  function(req, res) {
    let username = req.body.username
    res.redirect(`/${username}/log`)
  })

router.get('/landing')


router.get('/logout', function(req, res){
  req.logout()
  res.redirect('login')
})

module.exports = router
