import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new ApiError(400, "Only image files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});


const uploadProfileImage = [
  upload.single("profileImage"), 
  
  async (req, res, next) => {
    if (!req.file) return next();

    try {
      const fileBase64 = req.file.buffer.toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "bnv-users",
        resource_type: "image"
      });
      req.profileImageUrl = result.secure_url; 
      
      next();
    } catch (error) {
      next(new ApiError(500, "Image upload failed: " + error.message));
    }
  }
];

export default uploadProfileImage;