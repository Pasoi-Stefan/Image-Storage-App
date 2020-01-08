
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

    // GET photo-deposit
    app.get('/photo-deposit', authGuard, function(req, res) {

        res.sendFile(__dirname + '/pages/photo-deposit.html');

    });

    // Get logout
    app.get('/logout', function(req, res) {

        req.logout();
        req.flash('succes_masg', 'Logged out!');
        res.redirect('/login');

    });

    //GET username
    app.get('/photo-deposit/username', authGuard, function(req, res) {

        res.json({ username: req.user.username});

    });





};
