const express = require('express');
const router = express.Router();
const passport = require('passport')
const Entry = require('../models/entry')
const User = require('../models/user')
const middleware = require("../middleware/auth")

router.get('/signup',function(req, res) {
  res.render('signup', {message: req.flash("error")})
})

router.post('/signup', function(req, res, next) {
  User.register(new User({username: req.body.username, email: req.body.email}),
    req.body.password,
    function(err, user){
      if(err){
        console.log(err)
        req.flash("error", "invalid registration entries")
        return res.redirect('signup')
      }
      let username = req.body.username
      passport.authenticate('local')(req, res, function() {
        res.redirect('/userProfileRedirect')
    })
  })
})

router.get('/userProfileRedirect', function(req, res) {
  let username = req.user.username
  let email = req.user.email
  res.render('newUser', {username, email})
})

router.get('/newUser/:username', function(req, res){
  res.render('newUser')
})

router.get('/login', function(req, res) {
  res.render('login')
})

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  function(req, res) {
    console.log(req.body)
    let username = req.body.username
    res.redirect(`/${username}/log`)
  }
)


router.get('/logout', function(req, res){
  console.log('GOODBYE ', req.body.username)
  req.logout()
  res.redirect('login')
})

module.exports = router
