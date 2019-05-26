const express = require('express')
const router = express.Router( {mergeParams: true })
var passport = require('passport')
var middleware = require("../middleware/auth")
var User = require('../models/user')
var Entry = require('../models/entry')
var moment = require('moment')
moment().format()

// const { createEntry } = require('../handlers/entries')
// router.route('/').post(createEntry)

const getToday = function(){
  var today = new Date()
  return {
    month: today.getMonth(),
    day: today.getDate(),
    year: today.getFullYear()
  }
}

router.get('/secret', function(req, res, next){
  if(err){
    console.log(err)
    next(err)
  }else{
    return res.render('secret')
  }
})

// Post for a previous or future date
// http://localhost:3000/tim/log/goto?day=14&month=4&year=2019
router.post('/:username/log/goto', middleware.isLoggedIn, function(req, res, next) {
  console.log('we are making a POST Request for a specific date')
  //check if req.query dates are the same as today
  var queryDate = {
    month: req.query.month * 1,
    day: req.query.day * 1,
    year: req.query.year * 1
  }

  var today = new Date()
  var todayDate = {
    month: today.getMonth(),
    day: today.getDate(),
    year: today.getFullYear()
  }
  console.log('THE TODAY DATE IS ', todayDate)

  function newCreatedAtDate() {
    var result = null
    var queryDateVals = Object.values(queryDate)
    var todayDateVals = Object.values(todayDate)
    console.log(queryDateVals, todayDateVals)
    for(let i = 0; i < queryDateVals.length; i++){
      if (queryDateVals[i] !== todayDateVals[i]) {
        result = false
      } else {
        result = true
      }
    }

    if(result) {
      return new Date(queryDate.year, queryDate.month, queryDate.day )
    } else {
      return today
    }
  }

  var name = req.body.name
  var carb = req.body.carb
  var fat = req.body.fat
  var protein = req.body.protein
  var newFood = {name, carb, fat, protein, user: {id:'', username: ''}, createdAt: newCreatedAtDate() }
  var userId = ''
  User.findOne({username: req.params.username}, function(err, user) {
    if(err) {
      console.log(err)
      res.redirect('back')
    } else {
      userId = user._id
      newFood.user.id = user._id
      newFood.user.username = user.username
      console.log('the username is ', user.username)
      Entry.create(newFood, function(err, entry) {
        if(err) {
          console.log(err)
        } else {
          console.log(entry)
          console.log('the food user is ', user)
          console.log('the users log has ', user.log)
          user.log.push(entry._id)
          user.save()
        }
      })
    }
  })

  // let userEntries = ''
  // Entry.find({user.id: userId}, function(err, logs) {
  //   if(err) {
  //     console.log(err)
  //   } else {
  //     console.log(logs)
  //     userEntries = logs
  //   }
  // })
  // return res.render(`userlog` ,{ username: req.params.username })
  return res.json(newFood)
})

// Current Date Post
router.post('/:username/log', function(req, res, next) {
  //check if we have a dateObj sent
  console.log('Hello from the best post route')

  var name = req.body.name
  var carb = req.body.carb
  var fat = req.body.fat
  var protein = req.body.protein
  var newFood = {name, carb, fat, protein, user: {id:'', username: ''} }

  if(req.body.dateObj){
    console.log('!! WE HAVE A DATE OBJ SENT !!' , req.body.dateObj)
    newFood.createdAt = req.body.dateObj
  }
  var userId = ''
  console.log("THE NEW FOOD IS, ", newFood)
  User.findOne({username: req.params.username}, function(err, user) {
    if(err) {
      console.log(err)
      res.redirect('back')
    } else {
      console.log('THE USER IN THE POST ROUTE IS ', user)
      userId = user._id
      newFood.user.id = user._id
      newFood.user.username = user.username
      Entry.create(newFood, function(err, entry) {
        if(err) {
          console.log(err)
        } else {
          console.log(entry)
          user.log.push(entry._id)
          user.save()
        }
      })
    }
  })

  // let userEntries = ''
  // Entry.find({user.id: userId}, function(err, logs) {
  //   if(err) {
  //     console.log(err)
  //   } else {
  //     console.log(logs)
  //     userEntries = logs
  //   }
  // })
  return res.json(newFood)
  // return res.render(`userlog` ,{ username: req.params.username })
})


//NEW GET ROUTE
router.get('(/:username/log|/:username/log/goto)', middleware.isLoggedIn, function(req, res) {
  console.log('HELLO FROM THE NEW GET ROUTE!!')
  let currDate = null
  let day = null
  let month = null
  let year = null
  let today = null
  let showTodayLink = false
  if(req.query.month){
    console.log('we have date query params!!!')
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

  let username = req.params.username
  let entries = null
  let goal = null
  User.findOne({username: username}, 'goal').exec(function(err, user){
      if(err){
        console.log(err)
      }else{
        goal = user.goal
        console.log('the user goal is ', goal.weight)
      }
    })

  let macros = null
  User.findOne({username: username}, 'macros').exec(function(err, user){
      if(err){
        console.log(err)
      }else{
        macros = user.macros
      }
    })

  User.findOne({username: username}, 'log').populate('log').exec(function(err, user){
    if(err) {
      console.log(err)
    } else {
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
      todaysEntries = entries.filter(function(meal){
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
      res.render('userlog', {username, goal, todaysEntries, currDate, macros, showTodayLink})
    }
  })
})

//SHOW main page: current day entries, daily target
router.get('/:username/log', middleware.isLoggedIn, function(req, res) {
  let currDate = {
    month: moment().month(),
    day: moment().date(),
    year: moment().year()
  }
  console.log(currDate.month, currDate.day, currDate.year)
  let username = req.params.username
  let entries = null
  let today = getToday()

  let goal = null
  User.findOne({username: username}, 'goal').exec(function(err, user){
      if(err){
        console.log(err)
      }else{
        console.log(user.goal)
        goal = user.goal
      }
    })

  let macros = null
  User.findOne({username: username}, 'macros').exec(function(err, user){
      if(err){
        console.log(err)
      }else{
        console.log(user.macros)
        macros = user.macros
      }
    })

  User.findOne({username: username}, 'log').populate('log').exec(function(err, user){
    if(err) {
      console.log(err)
    } else {
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
      todaysEntries = entries.filter(function(meal){
        let mealDate = {
          month: meal.createdAt.getMonth(),
          day: meal.createdAt.getDate(),
          year: meal.createdAt.getFullYear()
        }
        console.log('Our meal CREATION DATE was ', meal.createdAt, meal.name, mealDate.day, mealDate.month, mealDate.year)
        if(mealDate.month === today.month &&
          mealDate.day === today.day &&
          mealDate.year === today.year){
            return meal
          }
      })
      console.log('todays entries include ', todaysEntries)
      res.render('userlog', {username, goal, todaysEntries, currDate, macros})
    }
  })
})

//SHOW SPECIFIC DAY ENTRIES
// goto/?day=xx&month=xx&year=xxxx
router.get('/:username/log/goto' , middleware.isLoggedIn, function(req, res) {

  let currDate = {
    month: req.query.month,
    day: req.query.day,
    year: req.query.year
  }

  let username = req.params.username
  let entries = null
  let day = parseInt(req.query.day)
  let month = parseInt(req.query.month)
  let year = parseInt(req.query.year)
  console.log('our search date is ', day, month, year)

  User.findOne({username: username}, 'log').populate('log').exec(function(err, user){
    if(err) {
      console.log(err)
    } else {
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

      //filter on entry createdAt date == current date
      todaysEntries = entries.filter(function(meal){
        let mealDate = {
          month: meal.createdAt.getMonth(),
          day: meal.createdAt.getDate(),
          year: meal.createdAt.getFullYear()
        }
        console.log('Our meal CREATION DATE was ', meal.createdAt.getMonth(), 'our mealDate month is ', mealDate.month)
        console.log(parseInt(mealDate.day) === parseInt(day))
        if(mealDate.month === month &&
          mealDate.day === day &&
          mealDate.year === year){

            return meal
          }
      })
      console.log('todays entries include ', todaysEntries)
      res.render('userlogDated', {username, todaysEntries, currDate})
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
              console.log(data)
              res.json(data)
            }
          })
        }
    })
})

// UPDATE A FOOD ENTRY ROUTE
router.put("/:username/api/update/:id", middleware.checkEntryOwnership, function(req, res){
  console.log('hello from the PUT route server!')
  console.log(req.params.id)
  console.log(req.body.name, req.body.carb)
  let data = {
    carb: parseInt(req.body.carb),
    fat: parseInt(req.body.fat),
    protein: parseInt(req.body.protein),
    name: req.body.name,
    favorite: req.body.favorite
  }
  Entry.findByIdAndUpdate(req.params.id, data, function(err, updatedEntry){
      if(err){
          res.redirect("back");
      } else {
        console.log('successfully updated the entry')
          res.json(data);
      }
   });
});


module.exports = router
