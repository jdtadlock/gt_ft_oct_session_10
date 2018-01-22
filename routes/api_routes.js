var router = require('express').Router();
var User = require('../models').user;
var passport = require('passport');

// localhost:5000/api -- starts after this url
router.post('/register', function(req, res) {
	User.create({
		email: req.body.email,
		password: req.body.password
	}).then(function() {
		res.redirect('/');
	});
});

router.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if ( err ) return next(err);
		
		// If user doesn't exist, redirect back to log in page
		if ( !user ) return res.redirect('/');
		
		// If user exits, we check password
		req.logIn(user, function(err) {
			if (err) return next(err); 
			console.log(user);
      return res.redirect('/');
		});
	})(req, res, next);
});

module.exports = router;