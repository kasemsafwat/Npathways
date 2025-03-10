import Joi from 'joi';

// Joi here verifies every input for the certain APIs
// before sendin it to the database

const examRoute = '/api/exam';
const courseRoute = '/api/course';
const chatRoute = '/api/chat';

const exampleExam = {
  name: 'Exam 1',
  questions: [
    {
      question: 'Question 1',
      answers: [
        { answer: 'Answer 1', isCorrect: true },
        { answer: 'Answer 2', isCorrect: false },
        { answer: 'Answer 3', isCorrect: false },
      ],
      difficulty: 'medium',
    },
    {
      question: 'Question 2',
      answers: [
        { answer: 'Answer 1', isCorrect: false },
        { answer: 'Answer 2', isCorrect: true },
        { answer: 'Answer 3', isCorrect: false },
      ],
      difficulty: 'easy',
    },
    {
      question: 'Question 3',
      answers: [
        { answer: 'Answer 1', isCorrect: false },
        { answer: 'Answer 2', isCorrect: false },
        { answer: 'Answer 3', isCorrect: true },
      ],
      difficulty: 'hard',
    },
  ],
  timeLimit: 60,
};

const exampleCourse = {
  name: 'Course 1',
  requiredExams: [
    {
      _id: '123',
    },
  ],
  instructors: [],
  lessons: ['Lesson 1', 'Lesson 2', 'Lesson 3'],
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
          .valid('easy', 'medium', 'hard')
          .default('medium'),
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
        .valid('easy', 'medium', 'hard')
        .default('medium'),
    })
  ),
  timeLimit: Joi.number(),
});

const createCourseSchema = Joi.object({
  name: Joi.string().required(),
  requiredExams: Joi.array().items(
    Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message('Enter a valid id')
  ),
  instructors: Joi.array().items(
    Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message('Enter a valid id')
  ),
  lessons: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      image: Joi.string(),
      downloadLink: Joi.string(),
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
      .message('Enter a valid id')
  ),
  instructors: Joi.array().items(
    Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message('Enter a valid id')
  ),
  lessons: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      description: Joi.string(),
      image: Joi.string(),
      downloadLink: Joi.string(),
    })
  ),
  description: Joi.string(),
  image: Joi.string(),
});

const sendMessageSchema = Joi.object({
  message: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Enter a message',
    'any.required': 'Enter a message',
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

function getSchema(link, method) {
  if (method !== 'POST' && method !== 'PUT') return null;
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
  }
  return null;
}

export default async function verifyInput(req, res, next) {
  const schema = getSchema(req.originalUrl, req.method);

  if (!schema) {
    return res.status(404).json({ error: 'Route not found' });
  }

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  next();
}
