const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const { User } = require('./Schemas/user');
var jwt = require('jsonwebtoken');

const API_PORT = 9000;
const app = express();
app.use(cors());
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

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));




// // this is our get method
// // this method fetches all available data in our database
// router.get('/getData', (req, res) => {
//   Data.find((err, data) => {
//     if (err) return res.json({ success: false, error: err });
//     return res.json({ success: true, data: data });
//   });
// });


// // this is our update method
// // this method overwrites existing data in our database
// router.post('/updateData', (req, res) => {
//   const { id, update } = req.body;
//   Data.findByIdAndUpdate(id, update, (err) => {
//     if (err) return res.json({ success: false, error: err });
//     return res.json({ success: true });
//   });
// });

// // this is our delete method
// // this method removes existing data in our database
// router.delete('/deleteData', (req, res) => {
//   const { id } = req.body;
//   Data.findByIdAndRemove(id, (err) => {
//     if (err) return res.send(err);
//     return res.json({ success: true });
//   });
// });



router.post('/postUser', async (req, res) => {
  // console.log(req);
  // console.log(req.body);
  const {
    username, password, permission, firstName, lastName, email
  } = req.body;
  let newUser = new User({
    username,
    password,
    permission,
    firstName,
    lastName,
    email,
  });
  const result = newUser.save();
  res.send(result);
});


// router.get('/getUsers', async (req, res) => {
//   console.log(req.body);
//   const users = await User.find({}); // finds all in the db
//   console.log(users);
//   res.send(users);
// });


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


// this method will send a authentication token back to the client if
// the user and password are correct.
router.get('/authenticate', (req, res) => {
  User.findOne({ 
    username: req.query.username,
    password: req.query.password
   }, (err, user) => {
    if (user === null || err !== null) return res.json({ success: false });
    console.log(user);
    var token = jwt.sign(
      { username: user.username }, 
      'thisIsAInventoryManagementSystem123', 
      { expiresIn: 120 }
    );
    return res.json({ token: token });
   });
});



// // this method will send a authentication token back to the client if
// // the user and password are correct.
// router.get('/authenticate', (req, res) => {
//   User.find({ 
//     email: req.query.email,
//     password: req.query.password
//    }, (err, user) => {
//     if (err || user.length <= 0) return res.json({ 
//       success: false,
//       error: err 
//     });
//     console.log('hit');
//     var token = jwt.sign(
//       { email: user.email }, 
//       'thisIsAInventoryManagementSystem123', 
//       { expiresIn: 120}
//     );

//     res.send(token);
//   });
// });


// router.get('/getUserData', async (req, res) => {
//     console.log(req.body);
//   const {
//     username, password, permission, firstName, lastName, email
//   } = req.body;
//   let validUser = new User1.find({
//     username,
//     password,
//     permission,
//     firstName,
//     lastName,
//     email,
//   });
//   const result = validUser.save();
//   res.send(result);
// });


// router.post('/putCustData', async (req, res) => {
//   // console.log(req);
//   console.log(req.body);
//   const {
//     nameFirst, nameLast, companyName, email, phoneNum,
//   } = req.body;
//   let newCust = new Customer({
//     nameFirst,
//     nameLast,
//     companyName,
//     email,
//     phoneNum,
//   });
//   const result = newCust.save();
//   res.send(result);
// });



// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));