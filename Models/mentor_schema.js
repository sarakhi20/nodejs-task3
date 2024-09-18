//Importing Mongoose to create collection schema
import mongoose from "mongoose";

//creating the Mentor schema
const mentorSchema = new mongoose.Schema({
    name : String,
    email : String,
    assigned_students_id :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student'
    }]
}, {versionKey : false});

//creating the Mentor collection
const Mentor = mongoose.model('Mentor', mentorSchema);

//Exporting the Mentor collection
export default Mentor;