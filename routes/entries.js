const express = require('express')
const router = express.Router( {mergeParams: true })
const passport = require('passport')
const middleware = require("../middleware/auth")
const User = require('../models/user')
const Entry = require('../models/entry')
const moment = require('moment')

moment().format()

const getToday = function(){
  let today = new Date()
  return {
    month: today.getMonth(),
    day: today.getDate(),
    year: today.getFullYear()
  }
}

// Post for a previous or future date
// http://localhost:3000/tim/log/goto?day=14&month=4&year=2019
router.post('/:username/log/goto', middleware.isLoggedIn, function(req, res, next) {
  //check if req.query dates are the same as today
  let queryDate = {
    month: req.query.month * 1,
    day: req.query.day * 1,
    year: req.query.year * 1
  }

  let today = new Date()
  let todayDate = {
    month: today.getMonth(),
    day: today.getDate(),
    year: today.getFullYear()
  }

  let name = req.body.name
  let carb = req.body.carb || 0
  let fat = req.body.fat || 0
  let protein = req.body.protein || 0
  let favorite = req.body.favorite
  let newFood = {
    name,
    carb,
    fat,
    protein,
    user: {id:'', username: ''},
    createdAt: new Date(queryDate.year, queryDate.month, queryDate.day ),
    favorite
  }
  let userId = ''
  User.findOne({username: req.params.username}, function(err, user) {
    if(err) {
      next(err)
    } else {
      userId = user._id
      newFood.user.id = user._id
      newFood.user.username = user.username
      Entry.create(newFood, function(err, entry) {
        if(err) {
          next(err)
        } else {
          user.log.push(entry._id)
          let favoriteFood = {
            name: name,
            carb: carb,
            fat: fat,
            protein: protein,
            favorite: favorite
          }
          if(favoriteFood.favorite) {
            user.favorites.push(favoriteFood)
          }
          user.save()
        }
      })
    }
  })
  return res.json(newFood)
})

// Current Date Post
router.post('/:username/log', function(req, res, next) {
  let name = req.body.name
  let carb = req.body.carb || 0
  let fat = req.body.fat || 0
  let protein = req.body.protein || 0
  let favorite = req.body.favorite
  let newFood = {name, carb, fat, protein, user: {id:'', username: ''}, favorite }
  let userId = ''

  User.findOne({username: req.params.username}, function(err, user) {
    if(err) {
      console.log(err)
      res.redirect('back')
    } else {
      userId = user._id
      newFood.user.id = user._id
      newFood.user.username = user.username
      Entry.create(newFood, function(err, entry) {
        if(err) {
          console.log(err)
        } else {
          user.log.push(entry._id)
          let favoriteFood = {
            name: name,
            carb: carb,
            fat: fat,
            protein: protein,
            favorite: favorite
          }
          // if the food is favorited, add that food to the user's favorite array
          if(favoriteFood.favorite) {
            user.favorites.push(favoriteFood)
          }
          user.save()
        }
      })
    }
  })
  return res.json(newFood)
})


//NEW GET ROUTE
router.get('(/:username/log|/:username/log/goto)', middleware.isLoggedIn, function(req, res, next) {
  console.log('HELLO FROM THE NEW GET ROUTE!!', req.user.username)
  let currDate = null
  let day = null
  let month = null
  let year = null
  let today = null
  let showTodayLink = false
  if(req.query.month){
    showTodayLink = true
    currDate = {
      day : parseInt(req.query.day),
      month : parseInt(req.query.month),
      year : parseInt(req.query.year)
    }
    day = parseInt(req.query.day)
    month = parseInt(req.query.month)
    year = parseInt(req.query.year)
    today = currDate
  } else {
    currDate = {
      month: parseInt(moment().month()),
      day: parseInt(moment().date()),
      year: parseInt(moment().year())
    }
    today = getToday()
  }

  let username = req.user.username
  let entries = null
  let goal = null
  let macros = null
  let favorites = null
  let query = User.findOne({username: username})
  query.select('goal macros favorites log')
  query.populate('log')
  query.exec(function(err, user) {
    if(err || user == null) {
      if(user == null) {
        next(new Error("Not logged in as specified User"))
      }
      next(err)
    } else {
      goal = user.goal
      macros = user.macros
      favorites = user.favorites
      entries = user.log.map(function(meal){
        return {
          name: meal.name,
          carb: meal.carb,
          fat: meal.fat,
          protein: meal.protein,
          favorite: meal.favorite,
          createdAt: meal.createdAt,
          id: meal._id
        }
      })

      //filter on entry createdAt date
      let todaysEntries = entries.filter(function(meal){
        let mealDate = {
          month: meal.createdAt.getMonth(),
          day: meal.createdAt.getDate(),
          year: meal.createdAt.getFullYear()
        }
        if(mealDate.month === today.month &&
          mealDate.day === today.day &&
          mealDate.year === today.year){
            return meal
          }
      })
      res.render('userlog', {username, goal, todaysEntries, currDate, macros, showTodayLink, favorites})
      }
    })
})

// DELETE/DESTROY Route: delete the entry and remove from the user's log
router.delete("/:username/api/delete/:id", middleware.checkEntryOwnership, (req, res) => {
  Entry.findByIdAndRemove(req.params.id, function(err, foundEntry){
       if(err){
           console.log(err)
           next(err)
       } else {
         User.findOneAndUpdate({"username": req.params.username},
          {
            $pull: {
              log: req.params.id
            }
          }, function(err, data){
            if(err) {
              console.log(err)
            } else {
              res.json(data)
            }
          })
        }
    })
})

// UPDATE A FOOD ENTRY ROUTE
router.put("/:username/api/update/:id", middleware.checkEntryOwnership, function(req, res){
  let data = {
    carb: parseInt(req.body.carb),
    fat: parseInt(req.body.fat),
    protein: parseInt(req.body.protein),
    name: req.body.name,
  }

  Entry.findByIdAndUpdate(req.params.id, data, function(err, updatedEntry){
      if(err){
          res.redirect("back");
      } else {
          res.json(data);
      }
   });
});


module.exports = router
