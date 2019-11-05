var dotenv = require("dotenv")
dotenv.config()
var User = require('../models/user')
var Entry = require('../models/entry')
const middleware = {}

middleware.isLoggedIn = function(err, req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  if(err) {
    req.flash("error", err.message)
    console.log('caught an error in isLoggedIn')
  }
  req.flash("error", "Please Log In First")
  res.redirect('/login')
}

middleware.checkEntryOwnership = function(req, res, next) {
  if(req.isAuthenticated()) {
    Entry.findById(req.params.id, function(err, foundEntry) {
      if(err) {
        console.log(err, ' This is not your entry')
        re.redirect('/landing')
      } else {
        if(foundEntry.user.id.equals(req.user._id)) {
          console.log('You are allowed to edit this entry')
          next()
        } else {
          redirect('back')
        }
      }
    })
  } else {
    res.json('you dont have permission to edit')
  }
}

module.exports = middleware
