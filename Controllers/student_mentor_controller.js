//Importing Student collection from Models to do CRUD
import Student from '../Models/student_schema.js';

//Importing Mentor collection from Models to do CRUD
import Mentor from '../Models/mentor_schema.js';


//API connection
export const apiConnected = async (req, res)=>{
    try {

        //sending success response
        await res.status(200).json({message : `Mentor & Student API Connected Successfully! Kindly test the API in Postman`});

    } catch (error) {

        //throw error if anything goes wrong
        console.log(`There is a error while connecting to API : ${error}`);
        res.status(500).json({message : `Internal Server Error`});
    }
}


//Student Create
export const createStudent = async (req, res)=>{
    try {

        //creating a new student document
        const newStudent = new Student(req.body);

        //saving/inserting the document to the Student collection
        await newStudent.save();

        //sending success response
        res.status(201).json({message:`New Student created Successfully!`, data : newStudent});

    } catch (error) {

        //throw error if anything goes wrong
        console.error('Error while creating student:', error);
        res.status(500).json({message : `Internal Server Error`});
    }
}

//Get All students
export const getAllStudents = async (req, res)=>{
    try {

        //gathering all student info
        let students = await Student.find();

        //structuring the studentdata
        const studentData = students.map(student => ({
            _id : student._id,
            name: student.name,
            email: student.email,
            assigned_mentor_id: student.assigned_mentor_id
        }));
        // console.log(studentData);

        //sending success response
        res.status(200).json({message : 'Student data fetched successfully!', allStudent : studentData});

    } catch (error) {

        //throw error if anything goes wrong
        console.error('Error while fetching all students:', error);
        res.status(500).json({message : `Internal Server Error`});
    }
}


//Mentor Create
export const createMentor = async (req, res)=>{
    try {

        //creating a new mentor document
        const newMentor = new Mentor(req.body);

        //saving/inserting the document to the Mentor collection
        await newMentor.save();

        //sending success response
        res.status(201).json({message:`New Mentor created Successfully!`, data : newMentor});

    } catch (error) {

        //throw error if anything goes wrong
        console.error('Error while creating mentor:', error);
        res.status(500).json({message : `Internal Server Error`});
    }
}


//Get All Mentors
export const getAllMentors = async (req, res)=>{
    try {
        //gathering all mentor info
        let mentors = await Mentor.find();

        //structuring the mentordata
        const mentorData = mentors.map(mentor => ({
            _id : mentor._id,
            name: mentor.name,
            email: mentor.email,
            assigned_students_id: mentor.assigned_students_id
        }));
        // console.log(mentorData);

        //sending success response
        res.status(200).json({message : 'Mentor data fetched successfully!', allMentor : mentorData});

    } catch (error) {

        //throw error if anything goes wrong
        console.error('Error while fetching all mentors:', error);
        res.status(500).json({message : `Internal Server Error`});
    }
}


//Assigning a student or students for a mentor
export const assignStudentsToMentor = async (req, res) => {
    try {

        //getting mentor id from params
        const mentor_Id = req.params.id;

        //getting students id from body
        const { student_Ids } = req.body;

        //removing the studentId if any other mentor have it
        for (const student_Id of student_Ids) {
            // Find the mentor who has the student currently
            const existingMentor = await Mentor.findOne({ assigned_students_id: student_Id  });
            if (existingMentor) {
                // Remove the student Id from the mentor's assigned_students_id array
                existingMentor.assigned_students_id = existingMentor.assigned_students_id.filter(id => id.toString() !== student_Id.toString() );
                await existingMentor.save();
            }
        }

        //finding the particular mentor in the Mentor collection and updating the students
        const mentor = await Mentor.findById(mentor_Id);
        mentor.assigned_students_id.push(...student_Ids);
        await mentor.save();

        //If mentor not found, send response as mentor not found
        if(!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        //Updating the assingned_mentor_id in Student collection
        await Student.updateMany(
            { _id: { $in: student_Ids } },
            { $set: { assigned_mentor_id: mentor_Id } }
        );
        
        //sending success response
        res.status(200).json({ message: 'Students successfully assigned to mentor!', updatedMentor : mentor });

    } catch (error) {

        //throw error if anything goes wrong
        console.error('Error while assigning students to mentor:', error);
        res.status(500).json({message : `Internal Server Error`});
    }
};


//Assigning or Changing a Mentor for particular Student
export const assignMentorToStudent = async (req, res)=>{
    try {
        // Getting student id from params
        const student_Id = req.params.id;

        // Getting mentor id from body
        const { mentor_id } = req.body;

        // Find the existing mentor of the student
        const existingMentor = await Mentor.findOne({ assigned_students_id: student_Id });
        // If the student has an existing mentor, remove the student ID from the mentor's assigned_students_id array
        if (existingMentor) {
            existingMentor.assigned_students_id = existingMentor.assigned_students_id.filter(id => id.toString() !== student_Id.toString() );
            
            await existingMentor.save();
        }

        // Find the student and update the assigned_mentor_id
        const student = await Student.findByIdAndUpdate(student_Id, { assigned_mentor_id: mentor_id });

        // If student not found, send response as student not found
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update mentor's assigned_students_id
        const mentor = await Mentor.findById(mentor_id);
        mentor.assigned_students_id.push(student_Id);
        await mentor.save();

        // Sending success response
        res.status(200).json({ message: 'Mentor successfully assigned to student!', updatedStudent: student });
        
    } catch (error) {

        // Throw error if anything goes wrong
        console.error('Error while assigning mentor to student:', error);
        res.status(500).json({ message: `Internal Server Error` });
    }
}


//Get all students for a particular mentor
export const getStudentsByMentorID = async (req, res) => {
    try {

        //getting mentor's id from request params
        const mentorId  = req.params.id;

        //filtering the particular mentor in Mentor collection and populating the student details
        const mentor = await Mentor.findById(mentorId).populate('assigned_students_id');

        //If mentor not found, send response as mentor not found
        if(!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        //sending success response
        res.status(200).json({message: 'Data Fetched Successfully', students: mentor.assigned_students_id });

    } catch (error) {

        //throw error if anything goes wrong
        console.error('Error while fetching mentor students:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


//Getting previously assigned mentor for a particular student
export const getMentorByStudentId = async (req, res) => {
    try {
        //getting student's id from request params
        const student_Id = req.params.id;

        //filtering the particular student in Student collection and populating the mentor details
        const student = await Student.findById(student_Id).populate('assigned_mentor_id');

        //If student not found, send response as student not found
        if(!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        //sending success response
        res.status(200).json({message: 'Data Fetched Successfully', mentor: student.assigned_mentor_id });

    } catch (error) {
        console.error('Error while fetching student mentor:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}