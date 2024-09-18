//Importing Express to create express server
import express from 'express';

//Importing cors to restrict domains
import cors from 'cors';

//Importing dotenv to use sensitive info from env file
import dotenv from 'dotenv';

//Importing connectDB to connect the Atlas mongodb
import { connectDB } from './Database/DB_config.js';

//Importing StudentMenterRouter to make all necessary routings
import StudentMenterRouter from './Routers/student_mentor_routers.js';


//Configuring the .env file
dotenv.config();

//creating express server
const app = express();

//getting port number from .env file
const port = process.env.PORT;

//using cors
app.use(cors());

//using json() to parse body data
app.use(express.json());

//calling atlas mongodb connect function
connectDB();

//activating the base StudentMenterRouter
app.use('/', StudentMenterRouter);

//listening to the express server port
app.listen(port, ()=>{
    console.log(`Express server connected with the Port : ${port}`);
});