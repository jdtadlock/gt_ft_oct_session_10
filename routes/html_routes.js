var router = require('express').Router();
// localhost:5000/api -- starts after this url
router.get('/', function(req, res) {
	if ( req.user ) {
		// user is logged in
	} else {
		// user is not logged in
	}
	res.render('index', {user: req.user});
});

module.exports = router;