const multer = require("multer"); // For handling file uploads
const path = require("path");

// Set up Multer for file uploads (CV)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where CV files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });

// @route   POST /api/candidates/:id/submit-answers
router.post("/:id/submit-answers", upload.single("cv"), async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Parse the answers from the request body
    const answers = JSON.parse(req.body.answers);

    // Update candidate's answers
    candidate.quizzes.forEach((quiz, index) => {
      quiz.answer = answers[index]; // Update each quiz with the provided answer
    });

    // Handle the CV file if uploaded
    if (req.file) {
      candidate.cv = req.file.filename; // Save the filename of the uploaded CV
    }

    // Save the updated candidate
    await candidate.save();

    res.status(200).json({ message: "Answers and CV submitted successfully" });
  } catch (error) {
    console.error("Error saving answers and CV:", error);
    res.status(500).json({ message: "Error saving answers and CV", error });
  }
});
