const db = require('../models')

exports.createEntry = async function(req, res, next) {
  try {
    let entry = await db.Entry.create({
      name: req.body.name,
      carb: req.body.carb,
      fat: req.body.fat,
      protein: req.body.protein,
      favorite: req.body.favorite,
      user: req.params.id
    })
    let foundUser = await db.User.findById(req.params.id)
    foundUser.log.push(entry.id)
    await foundUser.save()
    let foundEntry = await db.Entry.findById(entry._id).populate('user', {
      email: true
    })
    return res.status(200).json(foundEntry)
  } catch(err) {
    return next(err)
  }
}

exports.getEntry = async function(req, res, next) {

}

exports.deleteEntry = async function(req, res, next) {

}
