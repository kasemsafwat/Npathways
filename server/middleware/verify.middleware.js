import Joi from "joi";

// Joi here verifies every input for the certain APIs
// before sendin it to the database

const examRoute = "/api/exam";
const courseRoute = "/api/course";
const chatRoute = "/api/chat";
const certificateRoute = "/api/certificate";
const enrollmentRoute = "/api/enrollment";

const exampleExam = {
  name: "Exam 1",
  questions: [
    {
      question: "Question 1",
      answers: [
        { answer: "Answer 1", isCorrect: true },
        { answer: "Answer 2", isCorrect: false },
        { answer: "Answer 3", isCorrect: false },
      ],
      difficulty: "medium",
    },
    {
      question: "Question 2",
      answers: [
        { answer: "Answer 1", isCorrect: false },
        { answer: "Answer 2", isCorrect: true },
        { answer: "Answer 3", isCorrect: false },
      ],
      difficulty: "easy",
    },
    {
      question: "Question 3",
      answers: [
        { answer: "Answer 1", isCorrect: false },
        { answer: "Answer 2", isCorrect: false },
        { answer: "Answer 3", isCorrect: true },
      ],
      difficulty: "hard",
    },
  ],
  timeLimit: 60,
};

const exampleCourse = {
  name: "Course 1",
  requiredExams: [
    {
      _id: "123",
    },
  ],
  instructors: [],
  lessons: ["Lesson 1", "Lesson 2", "Lesson 3"],
};

const createExamSchema = Joi.object({
  name: Joi.string().required(),
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        answers: Joi.array().items(
          Joi.object({
            answer: Joi.string().required(),
            isCorrect: Joi.boolean().default(false),
          })
        ),
        difficulty: Joi.string()
          .valid("easy", "medium", "hard")
          .default("medium"),
      })
    )
    .required(),
  timeLimit: Joi.number().required(),
});

const updateExamSchema = Joi.object({
  name: Joi.string(),
  questions: Joi.array().items(
    Joi.object({
      question: Joi.string(),
      answers: Joi.array().items(
        Joi.object({
          answer: Joi.string(),
          isCorrect: Joi.boolean().default(false),
        })
      ),
      difficulty: Joi.string()
        .valid("easy", "medium", "hard")
        .default("medium"),
    })
  ),
  timeLimit: Joi.number(),
});

const createCourseSchema = Joi.object({
  name: Joi.string().required(),
  requiredExams: Joi.array().items(
    Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Enter a valid id")
  ),
  instructors: Joi.array().items(
    Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Enter a valid id")
  ),
  lessons: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      image: Joi.string(),
      downloadLink: Joi.string(),
      duration: Joi.number(),
    })
  ),
  description: Joi.string().required(),
  image: Joi.string(),
});

const updateCourseSchema = Joi.object({
  name: Joi.string(),
  requiredExams: Joi.array().items(
    Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Enter a valid id")
  ),
  instructors: Joi.array().items(
    Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Enter a valid id")
  ),
  lessons: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      description: Joi.string(),
      image: Joi.string(),
      downloadLink: Joi.string(),
      duration: Joi.number(),
    })
  ),
  description: Joi.string(),
  image: Joi.string(),
});

const sendMessageSchema = Joi.object({
  message: Joi.string().trim().min(1).required().messages({
    "string.empty": "Enter a message",
    "any.required": "Enter a message",
  }),
});

const submitExamSchema = Joi.object({
  examId: Joi.string().required(),
  responses: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        selectedAnswers: Joi.array().items(Joi.string()),
      }).required()
    )
    .required(),
});

const createCertificateSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Certificate name is required",
    "any.required": "Certificate name is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Certificate description is required",
    "any.required": "Certificate description is required",
  }),
  image: Joi.string(),
  course: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Enter a valid course id"),
  pathway: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Enter a valid pathway id"),
  createdAt: Joi.date(),
});

const updateCertificateSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  image: Joi.string(),
  course: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Enter a valid course id"),
  pathway: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Enter a valid pathway id"),
  createdAt: Joi.date(),
});

const createEnrollmentSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name is required",
    "any.required": "Last name is required",
  }),
  dateOfBirth: Joi.date().required().messages({
    "date.base": "Date of birth is required",
    "any.required": "Date of birth is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Enter a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required",
    "any.required": "Phone number is required",
  }),
  address: Joi.object({
    country: Joi.string().required().messages({
      "string.empty": "Country is required",
      "any.required": "Country is required",
    }),
    city: Joi.string(),
    street: Joi.string(),
  })
    .required()
    .messages({
      "object.base": "Address is required",
      "any.required": "Address is required",
    }),
  motivationLetter: Joi.string().required().messages({
    "string.empty": "Motivation letter is required",
    "any.required": "Motivation letter is required",
  }),
  exam: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required().messages({
          "string.empty": "Question is required",
          "any.required": "Question is required",
        }),
        answer: Joi.string().required().messages({
          "string.empty": "Answer is required",
          "any.required": "Answer is required",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Exam is required",
      "any.required": "Exam is required",
    }),
  nationality: Joi.string(),
  facultyName: Joi.string(),
  GPA: Joi.number(),
});

const updateEnrollmentSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  dateOfBirth: Joi.date(),
  email: Joi.string().email(),
  phone: Joi.string(),
  address: Joi.object({
    country: Joi.string(),
    city: Joi.string(),
    street: Joi.string(),
  }),
  motivationLetter: Joi.string(),
  exam: Joi.array().items(
    Joi.object({
      question: Joi.string(),
      answer: Joi.string(),
    })
  ),
  nationality: Joi.string(),
  facultyName: Joi.string(),
  GPA: Joi.number(),
});

function getSchema(link, method) {
  if (method !== "POST" && method !== "PUT") return null;
  if (link === `${examRoute}/createExam`) {
    return createExamSchema;
  } else if (link.includes(`${examRoute}/updateExam`)) {
    return updateExamSchema;
  } else if (link === `${courseRoute}/createCourse`) {
    return createCourseSchema;
  } else if (link.includes(`${courseRoute}/updateCourse`)) {
    return updateCourseSchema;
  } else if (link.includes(`${chatRoute}/sendMessage`)) {
    return sendMessageSchema;
  } else if (link.includes(`${examRoute}/submitExam`)) {
    return submitExamSchema;
  } else if (link === `${certificateRoute}/createCertificate`) {
    return createCertificateSchema;
  } else if (link.includes(`${certificateRoute}/updateCertificate`)) {
    return updateCertificateSchema;
  } else if (link === `${enrollmentRoute}/createEnrollment`) {
    return createEnrollmentSchema;
  } else if (link.includes(`${enrollmentRoute}/updateEnrollment`)) {
    return updateEnrollmentSchema;
  }
  return null;
}

export default async function verifyInput(req, res, next) {
  const schema = getSchema(req.originalUrl, req.method);

  if (!schema) {
    return res.status(404).json({ error: "Route not found" });
  }

  // Parse stringified JSON arrays and objects in request body
  try {
    for (const key in req.body) {
      const value = req.body[key];
      if (
        typeof value === "string" &&
        ((value.trim().startsWith("[") && value.trim().endsWith("]")) ||
          (value.trim().startsWith("{") && value.trim().endsWith("}")))
      ) {
        try {
          req.body[key] = JSON.parse(value);
        } catch (parseError) {
          // If parsing fails, keep the original string value
          console.log(`Failed to parse ${key}: ${parseError.message}`);
        }
      }
    }
  } catch (error) {
    console.log("Error processing request body:", error);
  }

  // console.log(req.body);

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  next();
}
