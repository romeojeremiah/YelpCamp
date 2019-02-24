var express = require('express')
var router = express.Router({mergeParams: true})
var passport = require('passport')
var User = require('../models/user')

//app a landing page on the root page by rendering the landing.ejs page
router.get('/', function (req, res){
    res.redirect('/campgrounds')
})

//=============
//AUTH ROUTES
//===============
router.get('/register', function(req, res){
    res.render('register')
})
//handle signup logic
router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render('register')
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect('/campgrounds')
        })
    }) //register takes the password and hashes it.
})
//handle login route
//show login form
router.get('/login', function(req, res){
    res.render('login')
})
//handle login logic
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req,res){
    res.send('Login logic starts here')
})

//logout route
router.get('/logout', function(req, res){
    req.logout()
    res.redirect('/campgrounds')
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

module.exports = router