//Importing Mongoose to create collection schema
import mongoose from "mongoose";

//creating the Student schema
const studentSchema = new mongoose.Schema({
    name : String,
    email : String,
    assigned_mentor_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Mentor'
    }
}, {versionKey : false} );

//creating the Student collection
const Student = mongoose.model('Student', studentSchema);

//Exporting the student collection
export default Student;