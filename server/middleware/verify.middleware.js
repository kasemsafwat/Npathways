import Joi from 'joi';

// Joi here verifies every input for the certain APIs
// before sendin it to the database

const examRoute = '/api/exam';

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

function getSchema(link, method) {
  if (method !== 'POST' && method !== 'PUT') return null;
  if (link === `${examRoute}/createExam`) {
    return createExamSchema;
  } else if (link.includes(`${examRoute}/updateExam`)) {
    return updateExamSchema;
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
