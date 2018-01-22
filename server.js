var express = require('express');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 5000;
var User = require('./models').user;
var session = require('express-session');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var setup = require('./config/setup');

passport.use(new Strategy({
	usernameField: 'email'
}, function(email, password, cb) {
	User.findOne({
		where: {
			email: email
		}
	}).then(function(user) {
		if ( user ) {
			// Check password
			if ( user.password == password ) {
				cb(null, user);
			} else {
				cb(null, false);
			}
		} else {
			return cb(null, false);
		}
	}).catch(function(err) { 
		console.log('error');
		return cb(err) 
	});
}));

passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	User.findById(id).then(function(user) {
		cb(null, user);
	});
});


var app = express();

// Setup Handlebars
// looks for /views/layouts/main.handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Setup body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup the session
app.use(session({
	secret: setup.secret,
	proxy: true,
	resave: false,
	saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Setup api routes
var html_routes = require('./routes/html_routes');
var api_routes = require('./routes/api_routes');
app.use('/', html_routes);
app.use('/api', api_routes);

// Start Express Server
app.listen(port, function() {
	User.sync();
	console.log('Listening on port ' + port);
});



