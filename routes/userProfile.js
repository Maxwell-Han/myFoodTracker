const express = require('express')
const router = express.Router( {mergeParams: true })
var passport = require('passport')
var middleware = require("../middleware/auth")
var User = require('../models/user')
var Entry = require('../models/entry')
var moment = require('moment')
moment().format()

router.post('/setProfile', function(req, res, next){
  // get form data for the user
  // query db to get user and update values
  // redirect to confirmation page/home page with links to go to
  //  user log, profile or stats pages
  let username = req.user.username
  let {email, weight, bodyFat, carbs, fats, protein } = req.body
  let data = {
    email,
    macros: {
      carbs,
      fats,
      protein
    },
    profile:[
      {
        weight,
        bodyFat
      }
    ]
  }
  User.findOneAndUpdate( {username: username}, data, function(err, updatedUser){
    if(err) {
      console.log(err)
      res.redirect('back')
    } else {
      console.log(updatedUser, 'Successfully added profile details!')
      res.redirect(`/${req.user.username}/log`)
    }
  })
})

module.exports = router
