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
router.get('/:username/userStats', function(req, res, next) {
  var startDate = moment().day(0)
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
    res.json(favorites)
  }).catch( e => res.send(e))
})

module.exports = router
