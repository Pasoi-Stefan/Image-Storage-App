
const authGuard = require('./authGuard').authGuard;

exports.apply = function(app, bcrypt, passport, User, upload) {

    // POST register
    app.post('/register',  function(req, res) {

        User.findOne({ username: req.body.username})
            .then(function(user) {

                if(user){

                    var usernameError = 'Username taken!';
                    res.render(__dirname + '/pages/register.ejs', {usernameError});

                } else {

                    bcrypt.hash(req.body.password, 10)
                        .then(function(newPass) {

                            var newUser = new User({
        
                                username: req.body.username,
                                password: newPass
                
                            });
                
                            newUser.save()
                                .then(function(user) {
                
                                    req.flash('success_msg', 'Registration Succesful!')
                                    res.redirect('/login');
                                    console.log('New registration!');
                
                                })
                                .catch(function(err) {
                
                                    console.log(err);
                
                                });

                        })
                        .catch(function(err) {

                            console.log(err);

                        });

                }
                    
            })
            .catch(function(err) {

                console.log(err);

            });

    });

    // POST login
    app.post('/login', function(req, res, next) {

        passport.authenticate('local', {

            successRedirect: '/greyscale',
            failureRedirect: '/login',
            failureFlash: true

        })(req, res, next);

    });

    // POST upload
    app.post('/greyscale/upload', authGuard, upload.single('image'), function(req, res) {

        res.end();
    
    });

};