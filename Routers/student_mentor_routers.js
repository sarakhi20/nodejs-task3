//Importing express to use Router method
import express from 'express';

//Importing Controller functions to make routing
import { apiConnected, assignMentorToStudent, assignStudentsToMentor, createMentor, createStudent, getAllMentors, getAllStudents, getMentorByStudentId, getStudentsByMentorID } from '../Controllers/student_mentor_controller.js';

//Creating Router
const router = express.Router();

//Api connection routing
router.get('/', apiConnected);

//Create student routing
router.post('/create-student', createStudent);
//Get All student info routing
router.get('/students', getAllStudents);

//Create mentor routing
router.post('/create-mentor', createMentor);
//Get All mentor info routing
router.get('/mentors', getAllMentors);

//Assigning students to particular mentor routing
router.put('/assign-students-to-mentor/:id', assignStudentsToMentor);

//Assigning a mentor to a particular student routing
router.put('/assign-mentor-to-student/:id', assignMentorToStudent);

//Get all students for a particular mentor routing
router.get('/mentor-students/:id', getStudentsByMentorID);

//Getting previously assigned mentor for a particular student
router.get('/student-mentor/:id', getMentorByStudentId);


//exporting the router to use in base routing
export default router;