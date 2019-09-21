var mongoose = require("mongoose");
// var bcrypt = require('bcrypt')
var passportLocalMongoose = require('passport-local-mongoose')

var userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  name: String,
  goal: {
    weight: Number,
    bodyFat: Number
  },
  macros: {
    carbs: Number,
    fats: Number,
    protein: Number
  },
  profile: [
    {
      createdAt: {type: Date, default: Date.now },
      startingPoint: {type: Boolean, default: false },
      weight: Number,
      bodyFat: Number
    }
  ],
  log: [
    {
      type: mongoose.Schema.Types.ObjectId,
			ref: "Entry"
    }
  ],
  favorites : [
    {
      name: { type: String, default: 'Meal' },
      carb: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      favorite: {type: Boolean, default: false }
    }
  ]
})

// userSchema.pre('save', async function(next){
//   try {
//     if (!this.isModified('password')) {
//       return next()
//     }
//     let hashedPassword = await bcrypt.hash(this.password, 10)
//     this.password = hashedPassword
//     return next()
//   } catch(err) {
//     return next(err)
//   }
// })
//
// userSchema.methods.comparePassword = async function(candidatePassword, next) {
//   try {
//     let isMatch = await bcrypt.compare(candidatePassword, this.password)
//     return isMatch
//   } catch(err) {
//     return next(err)
//   }
// }

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema);
