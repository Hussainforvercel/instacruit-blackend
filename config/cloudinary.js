const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "resumes", // Folder in Cloudinary
    allowed_formats: ["pdf", "doc", "docx"], // Acceptable formats
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

// Initialize multer with the cloudinary storage
const upload = multer({ storage });

module.exports = upload;
