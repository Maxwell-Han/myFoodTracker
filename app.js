require("dotenv").config()
var express = require('express')
var mongoose = require('mongoose')
mongoose.set('debug', true)
mongoose.connect('mongodb://localhost:27017/testmacros', {
  keepAlive: true,
})
var User = require('./models/user')
var Entry = require('./models/entry')

var passport = require('passport')
var LocalStrategy = require('passport-local') // .Strategy?
var passportLocalMongoose = require('passport-local-mongoose')
var middleware = require("./middleware/auth")
var app = express()

var authRoutes = require('./routes/auth')
var entryRoutes = require('./routes/entries')

app.use(require('express-session')({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}))
// serve static files from /public
app.use(express.static(__dirname + '/public'))
// app.use('/public', express.static(__dirname + '/public'));
// app.use("/static", express.static('./static/'))
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.get('/', function(req, res) {
  res.render('index')
})

app.use(authRoutes)
app.use(entryRoutes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  return res.status(err.status || 500).json({
    error: {
      message: err.message || "Oops! Something went wrong."
    }
  })
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Macro Tracker app listening on port 3000');
});
