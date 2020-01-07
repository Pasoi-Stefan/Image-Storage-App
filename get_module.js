
const authGuard = require('./authGuard').authGuard;

exports.apply = function(app) {

    // GET index
    app.get('/', function(req, res) {

        res.redirect('/login');

    });

    // GET login
    app.get('/login', function(req, res) {

        res.render(__dirname + '/pages/login.ejs');

    });

    // GET register
    app.get('/register', function(req, res) {

        res.render(__dirname + '/pages/register.ejs');

    });

    // GET greyscale
    app.get('/greyscale', authGuard, function(req, res) {

        res.sendFile(__dirname + '/pages/greyscale.html');

    });

    // Get logout
    app.get('/logout', function(req, res) {

        req.logout();
        req.flash('succes_masg', 'Logged out!');
        res.redirect('/login');

    });

    //GET username
    app.get('/greyscale/username', authGuard, function(req, res) {

        res.json({ username: req.user.username});

    });





};
