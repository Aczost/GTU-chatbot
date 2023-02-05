const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.set('strictQuery', false);
// mongoose.connect("mongodb://127.0.0.1:27017/studentsDB",
//     () => {
//         console.log("Connected with database");
//     },
//     (err) => {
//         console.log(err);
//     });

// const studSchema = new Schema({
//     enrollment: Number,
//     contact: String,
//     feeStatus: Boolean
// });

const studentDetailsSchema = new Schema({
    enr : Number,
    sem : Number,
    exmFee : Boolean,
    result : String,
    branch : String,
    phnum : String
})

// const students = mongoose.model("Student", studSchema);
const studentDetails = mongoose.model("studentDetails", studentDetailsSchema);


// module.exports = students;
module.exports = studentDetails;