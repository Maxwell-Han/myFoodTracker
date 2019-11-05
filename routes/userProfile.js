const express = require('express')
const router = express.Router( {mergeParams: true })
var passport = require('passport')
var middleware = require("../middleware/auth")
var User = require('../models/user')
var Entry = require('../models/entry')
var moment = require('moment')
moment().format()

// look up user and get profile Details
//pass details through to the update form
router.get('/:username/profile', function(req, res, next) {
  let username = req.user.username
  let email = req.user.email
  let goal = null
  let macros = null
  let profile = null

  User.findOne({username: username}, 'goal macros profile').exec(function(err, user){
      if(err){
        console.log(err)
      }else{
        goal = user.goal
        macros = user.macros
        profile = user.profile[user.profile.length - 1]
        console.log('the profile is ', profile)
        res.render('profile', {username, email, goal, macros, profile})
      }
    })
})

router.get('/:username/updateProfile', function(req, res, next) {
  // look up user and get profile Details
  //pass details through to the update form
  let username = req.user.username
  let email = req.user.email
  let goal = null
  let macros = null
  let profile = null
  User.findOne({username: username}, 'goal macros profile').exec(function(err, user){
      if(err){
        console.log(err)
      }else{
        goal = user.goal
        macros = user.macros
        profile = user.profile[user.profile.length - 1]
        console.log(goal, macros, profile, typeof goal, typeof macros, typeof profile)
        // res.send(JSON.stringify(user))
        res.render('updateProfile', {username, email, goal, macros, profile})
      }
    })
})
/*
{"goal":{"weight":180,"bodyFat":0.18},
  "macros":{"carbs":160,"fats":60,"protein":160},
  "_id":"5cb1d46c9ebfed237c1580fe",
  "profile":[{
    "startingPoint":true,"createdAt":"2019-05-28T01:06:05.581Z",
    "_id":"5cec897d28c2d68c7c06e12e",
    "weight":190,
    "bodyFat":0.2}
  ]
}
*/
router.put('/:username/updateProfile', function(req, res, next){
  // get form data for the user
  // query db to get user and update values
  // redirect to confirmation page/home page with links to go to
  //  user log, profile or stats pages
  let username = req.params.username
  let {email, weight, bodyFat, carbs, fats, protein, goalWeight, goalBodyFat } = req.body
  bodyFat = bodyFat / 100

  let newProfile = {
    startingPoint: false,
    weight: weight,
    bodyFat: bodyFat
  }


  User.findOneAndUpdate( {username: username}, { $push: {"profile": newProfile},
    $set: {
      "email": email,
      "macros": {
        carbs: carbs,
        fats: fats,
        protein: protein
      },
      "goal": {
        weight: goalWeight,
        bodyFat: (goalBodyFat / 100)
      }
    } },
    function(err, updatedUser){
    if(err) {
      console.log(err)
      res.redirect('back')
    } else {
      console.log(updatedUser, 'Successfully UPDATED profile details!')
      res.redirect(`/${req.user.username}/log`)
    }
  })

})

router.post('/setProfile', function(req, res, next){
  // get form data for the user
  // query db to get user and update values
  // redirect to confirmation page/home page with links to go to
  //  user log, profile or stats pages
  let username = req.user.username
  let {email, weight, bodyFat, carbs, fats, protein } = req.body
  bodyFat = bodyFat / 100

  let data = {
    email,
    macros: {
      carbs,
      fats,
      protein
    },
    profile:[
      {
        startingPoint: true,
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
