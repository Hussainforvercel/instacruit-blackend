// const express = require("express");
// const router = express.Router();
// const Candidate = require("../models/Candidate");
// const nodemailer = require("nodemailer");

// // @desc    Create a new candidate entry
// // @route   POST /api/candidates
// router.post("/", async (req, res) => {
//   const { campaignInfo, customerInfo, quizzes } = req.body;

//   // Validate required fields
//   if (!campaignInfo || !customerInfo || !quizzes) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     const newCandidate = new Candidate({
//       campaignInfo,
//       customerInfo,
//       quizzes,
//     });

//     await newCandidate.save();

//     res
//       .status(201)
//       .json({ message: "Candidate added successfully", newCandidate });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// // @desc    Get all candidates
// // @route   GET /api/candidates
// router.get("/", async (req, res) => {
//   try {
//     const candidates = await Candidate.find();
//     res.status(200).json(candidates);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// // @desc    Get a candidate by ID
// // @route   GET /api/candidates/:id
// router.get("/:id", async (req, res) => {
//   try {
//     const candidate = await Candidate.findById(req.params.id);
//     if (!candidate) {
//       return res.status(404).json({ message: "Candidate not found" });
//     }
//     res.status(200).json(candidate);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// router.put("/:id/job-match", async (req, res) => {
//   try {
//     const { progress } = req.body; // Get the new progress from the request body
//     const candidate = await Candidate.findById(req.params.id);

//     if (!candidate) {
//       return res.status(404).json({ message: "Candidate not found" });
//     }

//     candidate.jobMatchProgress = progress; // Update the job match progress
//     await candidate.save(); // Save the candidate with the updated progress

//     res
//       .status(200)
//       .json({ message: "Job match progress updated successfully", candidate });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// router.put("/:id/position", async (req, res) => {
//   try {
//     const { columnPosition } = req.body; // Get the new column position from the request body
//     const candidate = await Candidate.findById(req.params.id);

//     if (!candidate) {
//       return res.status(404).json({ message: "Candidate not found" });
//     }

//     candidate.columnPosition = columnPosition; // Update the column position
//     await candidate.save(); // Save the candidate with the updated column position

//     res.status(200).json({
//       message: "Candidate column position updated successfully",
//       candidate,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// // @desc Create a new candidate entry
// // @route POST /api/candidates
// router.post("/", async (req, res) => {
//   const { campaignInfo, customerInfo, quizzes } = req.body;

//   if (!campaignInfo || !customerInfo || !quizzes) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     const newCandidate = new Candidate({
//       campaignInfo,
//       customerInfo,
//       quizzes,
//     });

//     await newCandidate.save();

//     res
//       .status(201)
//       .json({ message: "Candidate added successfully", newCandidate });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// // @desc Send an email
// // @route POST /api/candidates/send-email
// // router.post("/send-email", async (req, res) => {
// //   try {
// //     const { to, subject, text } = req.body;

// //     if (!to || !subject || !text) {
// //       return res.status(400).json({ message: "Missing required fields" });
// //     }

// //     // Create transporter using your email credentials
// //     const transporter = nodemailer.createTransport({
// //       service: "Gmail", // Or your email provider
// //       auth: {
// //         user: process.env.EMAIL_USER, // Ensure your environment variables are correct
// //         pass: process.env.EMAIL_PASS,
// //       },
// //     });

// //     const mailOptions = {
// //       from: process.env.EMAIL_USER, // Sender address
// //       to, // Receiver address from req.body
// //       subject, // Subject line
// //       text, // Plain text body
// //     };

// //     // Send email
// //     await transporter.sendMail(mailOptions);

// //     res.status(200).json({ message: "Email sent successfully" });
// //   } catch (error) {
// //     console.error("Error sending email:", error);
// //     res.status(500).json({ message: "Error sending email", error });
// //   }
// // });

// router.post("/send-email", async (req, res) => {
//   try {
//     const { to, subject, text, candidateId, questions } = req.body; // Capture candidateId and questions

//     if (!to || !subject || !text || !candidateId || !questions) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Create transporter for sending email
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text,
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);

//     // Find candidate and update their questions
//     const candidate = await Candidate.findById(candidateId);
//     if (!candidate) {
//       return res.status(404).json({ message: "Candidate not found" });
//     }

//     // Save the questions to the candidate in the database
//     candidate.questions = questions; // Add or update the questions field
//     await candidate.save();

//     res.status(200).json({ message: "Email sent and questions saved" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ message: "Error sending email", error });
//   }
// });

// router.get("/:id/get-questions", async (req, res) => {
//   try {
//     const candidate = await Candidate.findById(req.params.id);
//     if (!candidate) {
//       return res.status(404).json({ message: "Candidate not found" });
//     }

//     // Return the saved questions
//     res.status(200).json({ questions: candidate.questions });
//   } catch (error) {
//     console.error("Error fetching questions:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// router.post("/:id/submit-answers", async (req, res) => {
//   try {
//     const { questions, answers } = req.body;
//     const candidateId = req.params.id;

//     // Find the candidate by ID
//     const candidate = await Candidate.findById(candidateId);
//     if (!candidate) {
//       return res.status(404).json({ message: "Candidate not found" });
//     }

//     // Save the questions and answers
//     candidate.questions = questions; // Update the questions if needed
//     candidate.answers = answers; // Save the answers array

//     await candidate.save();

//     res.status(200).json({ message: "Answers saved successfully" });
//   } catch (error) {
//     console.error("Error saving answers:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.get("/:id/screening-answers", async (req, res) => {
//   try {
//     const candidate = await Candidate.findById(req.params.id);
//     if (!candidate) {
//       return res.status(404).json({ message: "Candidate not found" });
//     }

//     // Log the candidate object to inspect what is being fetched
//     console.log("Fetched candidate data:", candidate);

//     const questions = candidate.questions || [];
//     const answers = candidate.answers || [];

//     // Log the questions and answers before sending
//     console.log("Questions:", questions);
//     console.log("Answers:", answers);

//     res.status(200).json({ questions, answers });
//   } catch (error) {
//     console.error("Error fetching screening answers:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const nodemailer = require("nodemailer");
const { protect } = require("../middleware/authMiddleware"); // Import auth middleware
// const upload = require("../config/cloudinaryConfig");
const upload = require("../config/cloudinary");

// Utility function to create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// @desc Create a new candidate entry
// @route POST /api/candidates
router.post("/", protect, async (req, res) => {
  const { campaignInfo, customerInfo, quizzes } = req.body;

  if (!campaignInfo || !customerInfo || !quizzes) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newCandidate = new Candidate({
      campaignInfo,
      customerInfo,
      quizzes,
      userId: req.user.id, // Associate the candidate with the logged-in user
    });

    await newCandidate.save();
    res
      .status(201)
      .json({ message: "Candidate added successfully", newCandidate });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc Get all candidates for the logged-in user
// @route GET /api/candidates
router.get("/", protect, async (req, res) => {
  try {
    const candidates = await Candidate.find({ userId: req.user.id }); // Fetch candidates for the logged-in user
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc Get a candidate by ID
// @route GET /api/candidates/:id
// router.get("/:id", protect, async (req, res) => {
//   try {
//     const candidate = await Candidate.findOne({
//       _id: req.params.id,
//       userId: req.user.id, // Ensure the candidate belongs to the logged-in user
//     });
//     if (!candidate) {
//       return res.status(404).json({ message: "Candidate not found" });
//     }
//     res.status(200).json(candidate);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// @route GET /api/candidates/:id
router.get("/:id", protect, async (req, res) => {
  try {
    console.log("Candidate ID:", req.params.id);
    console.log("User ID:", req.user.id);

    const candidate = await Candidate.findOne({
      _id: req.params.id,
      userId: req.user.id, // Ensure the candidate belongs to the logged-in user
    });

    console.log("Fetched candidate:", candidate);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json(candidate);
  } catch (error) {
    console.error("Error fetching candidate:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc Update job match progress for a candidate
// @route PUT /api/candidates/:id/job-match
router.put("/:id/job-match", protect, async (req, res) => {
  const { progress } = req.body;

  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      userId: req.user.id, // Ensure the candidate belongs to the logged-in user
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.jobMatchProgress = progress;
    await candidate.save();
    res
      .status(200)
      .json({ message: "Job match progress updated successfully", candidate });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc Update column position for a candidate
// @route PUT /api/candidates/:id/position
router.put("/:id/position", protect, async (req, res) => {
  const { columnPosition } = req.body;

  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      userId: req.user.id, // Ensure the candidate belongs to the logged-in user
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.columnPosition = columnPosition;
    await candidate.save();
    res.status(200).json({
      message: "Candidate column position updated successfully",
      candidate,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc Send an email and save questions for a candidate
// @route POST /api/candidates/send-email
router.post("/send-email", protect, async (req, res) => {
  const { to, subject, text, candidateId, questions } = req.body;

  if (!to || !subject || !text || !candidateId || !questions) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Create email transporter
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Find candidate and update their questions
    const candidate = await Candidate.findOne({
      _id: candidateId,
      userId: req.user.id, // Ensure the candidate belongs to the logged-in user
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.questions = questions;
    await candidate.save();

    res.status(200).json({ message: "Email sent and questions saved" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
});

// @desc Get saved questions for a candidate
// @route GET /api/candidates/:id/get-questions
router.get("/:id/get-questions", protect, async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      userId: req.user.id, // Ensure the candidate belongs to the logged-in user
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({ questions: candidate.questions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// @desc Submit answers for a candidate
// @route POST /api/candidates/:id/submit-answers
// router.post("/:id/submit-answers", protect, async (req, res) => {
//   const { questions, answers } = req.body;
//   const candidateId = req.params.id;

//   try {
//     const candidate = await Candidate.findOne({
//       _id: candidateId,
//       userId: req.user.id, // Ensure the candidate belongs to the logged-in user
//     });

//     if (!candidate) {
//       return res.status(404).json({ message: "Candidate not found" });
//     }

//     candidate.questions = questions;
//     candidate.answers = answers;
//     await candidate.save();

//     res.status(200).json({ message: "Answers saved successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// router.get("/:id/screening-answers", protect, async (req, res) => {
//   try {
//     console.log("Fetching screening answers for candidate ID:", req.params.id);
//     console.log("Fetching for user ID:", req.user.id);

//     const candidate = await Candidate.findOne({
//       _id: req.params.id,
//       userId: req.user.id,
//     });

//     if (!candidate) {
//       console.log("Candidate not found");
//       return res.status(404).json({ message: "Candidate not found" });
//     }

//     console.log("Candidate found:", candidate);

//     // Parse stringified questions and answers arrays
//     const parsedQuestions = JSON.parse(candidate.questions[0]);
//     const parsedAnswers = JSON.parse(candidate.answers[0]);

//     res.status(200).json({
//       questions: parsedQuestions || [],
//       answers: parsedAnswers || [],
//     });

//     console.log("Questions sent:", parsedQuestions);
//     console.log("Answers sent:", parsedAnswers);
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

router.get("/:id/screening-answers", protect, async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({
      questions: candidate.questions || [],
      answers: candidate.answers || [],
      resumeUrl: candidate.resumeUrl || "", // Include the resume URL
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.post(
  "/:id/submit-answers",
  protect,
  upload.single("resume"),
  async (req, res) => {
    const { questions, answers } = req.body;
    const candidateId = req.params.id;

    try {
      const candidate = await Candidate.findOne({
        _id: candidateId,
        userId: req.user.id, // Ensure the candidate belongs to the logged-in user
      });

      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      // Update candidate questions and answers
      candidate.questions = JSON.parse(questions);
      candidate.answers = JSON.parse(answers);

      // Check if resume file is uploaded and save its Cloudinary URL
      if (req.file) {
        candidate.resumeUrl = req.file.path; // Save Cloudinary URL in the resumeUrl field
      }

      await candidate.save();

      res
        .status(200)
        .json({ message: "Answers and resume saved successfully" });
    } catch (error) {
      console.error("Error saving candidate data:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

module.exports = router;
