//Importing Mongoose to connect with atlas mongodb
import mongoose from "mongoose";

//Importing dotenv to use sensitive info from env file
import dotenv from 'dotenv';

//Configuring the .env file
dotenv.config();

//getting connectionString from .env file
const connectionString = process.env.AtlasURL;

//Connecting to Atlas MongoDB
export const connectDB = async ()=>{
    try {

        // making the connection with atlas mongodb
        const connection = await mongoose.connect(connectionString);
        console.log(`Successfully connected with Atlas MongoDB!`);
        return connection;

    } catch (error) {

        //throw error if anything goes wrong
        console.log(`Error while connecting with atlas mongodb : ${error}`);
    }
}