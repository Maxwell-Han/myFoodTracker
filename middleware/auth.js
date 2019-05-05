var dotenv = require("dotenv")
dotenv.config()
var User = require('../models/user')
var Entry = require('../models/entry')
const middleware = {}
// const jwt = require('jsonwebtoken')

middleware.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

middleware.checkEntryOwnership = function(req, res, next) {
  if(req.isAuthenticated()) {
    Entry.findById(req.params.id, function(err, foundEntry) {
      if(err) {
        console.log(err, ' This is not your entry')
        re.redirect('/landing')
      } else {
        // does req.username have the id property here?
        if(foundEntry.user.id.equals(req.user._id)) {
          console.log('You are allowed to edit this entry')
          next()
        } else {
          redirect('back')
        }
      }
    })
  } else {
    console.log('you dont have permission to edit')
  }
}

module.exports = middleware
// Authentication
// exports.loginRequired = function(req, res, next) {
//   try {
//     const token = req.headers.authorization.split(" ")[1]
//     jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
//       if (decoded) {
//         return next()
//       } else {
//         return next({
//           status: 401,
//           message: "Please log in first"
//         })
//       }
//     })
//   } catch(err) {
//     return next({ status: 401, message: "Please log in first" })
//   }
// }
//
// // Authorization
// exports.ensureCorrectUser = function(req, res, next) {
//   try {
//     const token = req.headers.authorization.split(" ")[1]
//     jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
//       if(decoded && decoded.id === req.params.id) {
//         return next()
//       } else {
//         return next({
//           status: 401,
//           message: "Unauthorized"
//         })
//       }
//     })
//   } catch(err) {
//     return next({ status: 401, message: "Unauthorized" })
//   }
// }
