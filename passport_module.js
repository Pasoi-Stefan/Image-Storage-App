exports.apply = function(app, passport, passport_local, moongose, bcrypt, User) {

    const localStrategy = passport_local.Strategy;
     
    passport.use(new localStrategy({ usernameField: 'username'}, 
                function(username, password, done) {

                    User.findOne({ username: username})
                        .then(function(user) {

                            if(!user){

                                return done(null, false, { message: 'Username not registered'});

                            }

                            bcrypt.compare(password, user.password, function(err, value) {

                                if(err)
                                    throw err;

                                if(value){

                                    return done(null, user);

                                } else {

                                    return done(null, false, { message: 'Password is not correct'});

                                }

                            });

                        })
                        .catch(function(err){

                            console.log(err);

                        });

                }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
     });
        
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
     });

    app.use(passport.initialize());
    app.use(passport.session());

};