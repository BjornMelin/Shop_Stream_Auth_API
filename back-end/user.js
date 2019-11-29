// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  permission: {
    type: String,
    enum: ['admin', 'inspector', 'manager', 'customer', 'csr', 'operator'],
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email : {
    type: String
  }
})

// export the new Schema so we could modify it using Node.js
module.exports.User1= mongoose.model("User1", UserSchema);