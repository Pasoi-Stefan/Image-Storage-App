

// Modules
const mongodb = require('mongodb');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const passport = require('passport');
const passport_local = require('passport-local');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const morgan = require("morgan");
const express = require('express');
const session = require('express-session');
const app = express();


// Custom Modules
const authGuard = require('./authGuard').authGuard;
const passport_module = require('./passport_module');
const get_module = require('./get_module');
const post_module = require('./post_module');


// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/greyscale', {useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


// Init gfs
let gfs;

db.once('open', function() {

    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
    console.log('Database connection succesful!');

});


// Create storage engine
const storage = new GridFsStorage({
    url: 'mongodb://127.0.0.1:27017/greyscale',
    options: {useNewUrlParser: true, useUnifiedTopology: true},
    file: function(req, file) {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = file.originalname;
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads',
            metadata: req.user._id
          };
          resolve(fileInfo);
        });
      });
    }
  });

  const upload = multer({
    
    storage: storage,
    fileFilter: function(req, file, cb) {

      if (file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
               file.mimetype === "image/jpeg" ||
                 file.mimetype === "image/bmp") {

          cb(null, true);

      } else {

        cb(new Error("File format should be PNG, JPG, JPEG or BMP"), false); 

      }

    }

  });


// User schema and model
const userSchema = new mongoose.Schema({

    username: String,
    password: String

});

const User = mongoose.model('User', userSchema);


// Settings
app.use(express.static(path.join(__dirname, 'pages')));
app.set('view-engine', 'ejs');
app.use(morgan("tiny"));
app.use(express.urlencoded({extended: 'false'}));

app.use(session({
    secret: 'shhhhh',
    resave: true,
    saveUninitialized: true,
 }));

app.use(flash());


 //Flash config
 app.use(function(req, res, next) {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();

 });


//Apply custom modules
passport_module.apply(app, passport, passport_local, bcrypt, User);
get_module.apply(app);
post_module.apply(app, bcrypt, passport, User, upload);

//GET images
app.get('/greyscale/images', authGuard, function(req, res) {

  gfs.files.find().toArray(function(err, images) {

      images.map(function(image) {
      
          if(JSON.stringify(image.metadata) === JSON.stringify(req.user._id)){

              image.belongs = true;
              

          } else {

              image.belongs = false;

          }

      });

      res.json({ array: images });

  });

});

// GET image
app.get('/image/:id', function(req, res) {

  var object_id = new mongodb.ObjectID(req.params.id);

  gfs.files.findOne({ _id: object_id }, function(err, image) {

    if(err)
      throw err;

    const readstream = gfs.createReadStream({

          _id: image._id

     });

    readstream.pipe(res);

  });

});

//DELETE image
app.delete('/delete/:id', function(req, res) {

  var object_id = new mongodb.ObjectID(req.params.id);

  gfs.remove({_id: object_id, root: 'uploads'}, function(err, gridStore) {

      if(err) 
        throw err;

      res.end();

  });

});

app.listen(3000, function() {
    
    console.log('Succesfully connected to port 3000!');

});