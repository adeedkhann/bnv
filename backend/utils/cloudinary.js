import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// This MUST be called before cloudinary.config
dotenv.config(); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,       // Fixed to match your .env
  api_secret: process.env.CLOUDINARY_SECRET   // Fixed to match your .env
});

export default cloudinary;