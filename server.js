const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const logger = require('morgan');
const User = require('./Schemas/user');
var jwt = require('jsonwebtoken');

const API_PORT = 9000;
const SECRET = 'thisIsAInventoryManagementSystem123';

const app = express();
app.use(cors());
app.use(logger('dev'));
const router = express.Router();

// this is our MongoDB database
const dbRoute = 'mongodb://127.0.0.1:27017/UserAuth';

// connects our back end code with the database
mongoose.connect(dbRoute, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true, 
  useFindAndModify: false 
});
let db = mongoose.connection;

// connect to the database
db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// this is our create methid
// this method adds new data in our database
router.post('/postUser', (req, res) => {
  let user = new User();
  const { username, password, permission, firstName, lastName } = req.query;
  user.username = username;
  user.password = password;
  user.permission = permission;
  user.firstName = firstName;
  user.lastName = lastName;
  user.save((err) => {
    if (err) return res.json({ 
      success: false, 
      error: err 
    });
    return res.json({ 
      success: true 
    });
  });
});


// this is our get method
// this method fetches all available data in our database
router.get('/getUsers', async (req, res) => {
  var peopleJSON = await User.find({});
  if (peopleJSON === null) return res.json({ 
    success: false, 
    user: user.length,
    error: err 
  });
  return res.json({ 
    success: true, 
    amount: peopleJSON.length,
    users: peopleJSON 
  });
});




router.get('/authenticate', (req, res) => {
  if (req.headers.token === undefined) return res.json({ success: false });
  const token = req.headers.token;
  // verify a token symmetric
  jwt.verify(token, SECRET, function(err, decoded) {
    if (err) console.log(err);
    User.findOne({ 
      username: decoded.data.username,
      password: decoded.data.password
     }, (err, user) => {
      if (user === null || err !== null) return res.json({ success: false });
      return res.json({ success: true });
     });
  });
});


// this method will send a authentication token back to the client if
// the user and password are correct.
router.get('/signIn', (req, res) => {
  User.findOne({ 
    username: req.query.username,
    password: req.query.password
   }, (err, user) => {
    if (user === null || err !== null) return res.json({ success: false });
    var token = jwt.sign(
      { 
        data: {
          username: user.username,
          password: user.password
        }
      }, 
      SECRET, 
      { expiresIn: 60 * 60 }
    );
    return res.json({ token: token });
   });
});


// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { username, password, permission } = req.query;
  if (username === undefined) return res.json({
    success: false,
    username: undefined
  });
  User.findOne({ username: username }, (err, user) => {
    if (err) return res.json({ 
      success: false, 
      error: err 
    });
    if (req.query.username != undefined) user.username = username;
    if (req.query.password != undefined) user.password = password;
    if (req.query.permission != undefined) user.permission = permission;
    user.save();
    return res.json({ 
      success: true,
      updatedUser: user
    });
  });
});




// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const username = req.query.username;
  User.findOne({ 'username': username }, (err, user) => {
    if (err) return handleError(err);
    if (user.permission === "admin") {
      User.findOneAndDelete(username, (err) => {
        if (err) return res.json({ 
          success: false, 
          error: err 
        });
        return res.json({ 
          success: true,
          removedUser: username
        });
      });
    }
  });
});


// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));