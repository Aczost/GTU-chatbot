const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.set('strictQuery', false);
const studData = new mongoose.Schema({
    enr : Number,
    sem : Number,
    exmfee : Boolean,
    result : String,
    branch : String,
    phnum : String
  })
  const studModel = mongoose.model("Stud", studData);
module.exports = studModel