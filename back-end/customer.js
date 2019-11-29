// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const CustomerSchema = new Schema({
  nameFirst: {
    type: String,
    unique: true,
    required: true
  },
  nameLast: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNum: {
    type: String,
    required: true
  },
})

// export the new Schema so we could modify it using Node.js
module.exports.Customer = mongoose.model("Customer", CustomerSchema);