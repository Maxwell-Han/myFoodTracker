const express = require('express')
const router = express.Router( {mergeParams: true })
var passport = require('passport')
var middleware = require("../middleware/auth")
var User = require('../models/user')
var Entry = require('../models/entry')
var moment = require('moment')
moment().format()

// User stats page
// GET past week's food data: client will show the week's cal over/under
/*
  get current date and find date of the starting sunday
  find food entries from user profile
*/
// GET current week entries AND all Favorites
router.get('/:username/userStats', middleware.isLoggedIn, function(req, res, next) {
  console.log('hello from the get userStats route')
  if(!req.user){
    console.log('skipping this route')
    next(err)
  }
  var startDate = moment().day(0).hour(0).minute(0)
  var endDate = moment()
  Promise.all([
    User.findOne( {username: req.params.username})
      .select('macros'),
    User.findOne( {username: req.params.username})
      .populate({
        path: 'log',
        match: {favorite: true }
      }),
    User.find( {username: req.params.username})
      .populate({
        path: 'log',
        match: {createdAt: {$gte: startDate, $lte: endDate} }
      })
  ]).then( ([userMacros, favQuery, entriesQuery]) => {
    let macros = userMacros.macros
    let favorites = JSON.stringify(favQuery.log) //array of favorited entries
    let weeklyEntries = JSON.stringify(entriesQuery[0].log) //array of week's entries
    res.render('userStats', {macros, favorites, weeklyEntries, username: req.user.username, showTodayLink: true})
  }).catch( e => {
    console.log('we caught an error', e)
    res.send(e)
  })
})


router.get('/:username/userStatsApiTest', function(req, res, next) {
  var startDate = moment().day(0).hour(0)
  var endDate = moment()
  Promise.all([
    User.findOne( {username: req.params.username})
      .populate({
        path: 'log',
        match: {favorite: true }
      }),
    User.find( {username: req.params.username})
      .populate({
        path: 'log',
        match: {createdAt: {$gte: startDate, $lte: endDate} }
      })
  ]).then( ([favQuery, entriesQuery]) => {
    let favorites = favQuery.log //array of favorited entries
    let weeklyEntries = entriesQuery[0].log //array of week's entries
    res.json(weeklyEntries)
  }).catch( e => res.send(e))
})
module.exports = router
