const express = require('express')
const router = express.Router( {mergeParams: true })
var passport = require('passport')
var middleware = require("../middleware/auth")
var User = require('../models/user')
var Entry = require('../models/entry')

// router.get('/:username/favorites', function(req, res, next) {
//   res.send('hello from the favorites page')
// })
router.post('/:username/favorites/delete', function(req, res, next) {
  let favId = req.body.formId
  console.log(req.body, req.params.username)
  User.findOne( {username: req.params.username})
    .then( (user) => {
      let fav = user.favorites
      let idx = null
      console.log('we are inside the then!!!')
      console.log(fav)
      for(let i = 0; i < fav.length; i++) {
        console.log(fav[i])
        if(fav[i]._id == favId) {
          idx = i
          fav.splice(i, 1)
          user.save()
          res.redirect('back')
          break
        }
      }
    })
    .catch( e => res.send(e))
})

router.post("/:username/favorites/update", function(req, res){
  console.log('hello from the PUT route server!')
  let id = req.body.formId
  let data = {
    name: req.body.name,
    carb: parseInt(req.body.carb),
    fat: parseInt(req.body.fat),
    protein: parseInt(req.body.protein)
  }
  User.findOne({username: req.params.username})
  .then( (user) => {
    let fav = user.favorites
    let currentFav = fav.filter( el => el._id == id)[0]

    console.log('the found favorite is ', currentFav)
    currentFav.name = data.name
    currentFav.carb = data.carb
    currentFav.fat = data.fat
    currentFav.protein = data.protein
    user.save()
    res.redirect('back')
  })
  .catch( e => res.send(e) )
});



router.get('/:username/favorites', function(req, res, next) {
    User.findOne( {username: req.params.username})
      .select('favorites')
      .then( (user) => {
        // let fav = JSON.stringify(user.favorites)
        //returns array of objs (favorited entries)
        let fav = user.favorites
        console.log(fav)
        res.render( 'userFavorites' , {
          username: req.params.username,
          favorites: fav,
          showTodayLink: true
        })
      })
      .catch( e => res.send(e))
})



router.post('/:username/favorites', function(req, res, next) {
    let newFav = {
      name: req.body.name,
      carb: req.body.carb,
      fat: req.body.fat,
      protein: req.body.protein,
      favorite: true
    }

    User.findOne( {username: req.params.username})
      .then( (user) => {
        let fav = user.favorites
        fav.push(newFav)
        user.save()
        res.redirect('back')
      })
      .catch( e => res.send(e))
})



module.exports = router
