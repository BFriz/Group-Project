var User = require('./models/user.js');


module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/profile')
        } else {
            res.render('index.ejs');
        }
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
      // render the page and pass in any flash data if it exists
      res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('dashboard.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email', 'public_profile', 'user_friends'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // OUR OWN ROUTES TO RUN THE APP =====================
    // =====================================


    app.get('/users', isLoggedIn, function(req, res) {
      console.log(req.user)
      // var current_user = req.user.facebook;
      var to_send = {current_user: req.user}
      User.find({}, function(err, users){
          to_send.users = users
          res.send(to_send);
      })
    })

    app.put('/users/mood', isLoggedIn, function(req, res) {
      User.update(
        { _id: req.user._id },
        { $set: { mood: req.body.mood } },
        { multi: true }
        , function(err, user) {
          console.log('success update mood?', user);
          res.send(201, user);
        });
    })

    app.put('/users/dislikes', isLoggedIn, function(req, res) {
      User.update(
        { _id: req.user._id },
        { $set: {dislikes: req.body.new_dislikes } },
        { multi: true }
        , function(err, user) {
          console.log('success update dislikes?', user);
          res.send(201, user);
        });
    })


    app.get('/users/:id', function(req, res) {
      User.find({_id: id}, function(err, user) {
        res.send(user);
      })
    })

    app.get('/map', function(req, res) {
        User.find({}, function(err, users){
            res.send(users)
        })
    })




}; // end module export

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}












// Facebook stuff
// module.exports = function(app, passport) {

//    // route for home page
//     app.get('/', function(req, res) {
//         // res.render('index.ejs'); // load the index.ejs file

//     });

//     // route for login form
//     // route for processing the login form
//     // route for signup form
//     // route for processing the signup form

//     // route for showing the profile page
//     app.get('/profile', isLoggedIn, function(req, res) {
//         res.render('profile.ejs', {
//             user : req.user // get the user out of session and pass to template
//         });
//     });

//     // =====================================
//     // FACEBOOK ROUTES =====================
//     // =====================================
//     // route for facebook authentication and login
//     app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

//     // handle the callback after facebook has authenticated the user
//     app.get('/auth/facebook/callback',
//         passport.authenticate('facebook', {
//             successRedirect : '/profile',
//             failureRedirect : '/'
//         }));

//     // route for logging out
//     app.get('/logout', function(req, res) {
//         req.logout();
//         res.redirect('/');
//     });

// };

// // route middleware to make sure a user is logged in
// function isLoggedIn(req, res, next) {

//     // if user is authenticated in the session, carry on
//     if (req.isAuthenticated())
//         return next();

//     // if they aren't redirect them to the home page
//     res.redirect('/');
// }