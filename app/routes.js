module.exports = function(app, passport) {
//var mongoose = require('mongoose');
var User       = require('../app/models/user');

//var Report       = require('../app/models/user');
// normal routes ===============================================================
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });
    app.get('/index', function(req, res) {
        res.render('index.ejs');
    });



    // PROFILE SECTION =========================
    /*
        app.get('/profile', isAdminAccount,function(req, res) {
            res.render('profile.ejs', {
            user : req.user
            });
        });
    */
    // LOGOUT ==============================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });


        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });        });
        app.get('/loginHome', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/teacher', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        
        // show the signup form

        app.get('/teacher', isAdminAccount,function(req, res) {
            User.find({},function(err,users){
                res.render('teacher.ejs', {
                    user : users
                });
            });
        });

       /*
        app.get('/profile', isAdminAccount,function(req, res) {
            res.render('profile.ejs', {
            user : req.user
            });
        });
        */


        app.get('/teacher',function(req, res) {
            res.render('emoji.ejs',{});    
        });
        app.get('/emoji',isLoggedIn,function(req, res) {
            res.render('emoji.ejs', {}); 
        });

     //   app.post('/emoji',isLoggedIn, passport.authenticate('local-signup', {}));
        app.post('/emoji',isLoggedIn,function(req, res) {
            var user            = req.user;
            user.local.emoji.push(req.body.emoji);

            user.save();
            console.log(user.local.emoji);
         //   console.log(req.body.emoji);
        });
        app.get('/report',isLoggedIn,function(req, res) {
            res.render('report.ejs', {}); 
        });

        app.post('/report',isLoggedIn,function(req, res) {
            //var newReport            = new Report();
            var user            = req.user;
            //console.log(user);

            var newUser            = new User();

            newUser.publicReport.realname    = user.local.realname;
            newUser.publicReport.date =  req.body.date;
            newUser.publicReport.message = [req.body.message1,req.body.message2,req.body.message3];
            newUser.save();
            //res.render('report.ejs', {}); 
            res.redirect('/logout');  
            console.log(newUser);
         //   console.log(req.body.emoji);
        });



        // process the signup form
        app.post('/teacher',isAdminAccount, function(req,res){
            var newUser                = new User();
            newUser.local.username    = req.body.username.toLowerCase();
            newUser.local.password = newUser.generateHash(req.body.password);
            newUser.local.realname     = req.body.realname;
            newUser.local.isAdmin  = req.body.isAdmin;
            newUser.save();
            res.redirect('/teacher');
        });

        app.get('/CreateAdmin', function(req,res){
            var newUser                = new User();
            newUser.local.username    = 'admin';
            newUser.local.password = newUser.generateHash('stem');
            newUser.local.realname     = '';
            newUser.local.isAdmin  = true;
            newUser.save();
            res.redirect('/logout');
        });


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.username    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });



};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
function isAdminAccount(req, res, next) {
    var user            = req.user;
    if (req.isAuthenticated()&&user.local.isAdmin==true)
        return next();

    res.redirect('/emoji');
}