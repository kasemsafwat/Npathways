import React, { useState } from "react";
import {
  TextField,
  Checkbox,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router";

const QuizComponent = () => {
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      questionText: "",
      answers: [
        { id: Date.now(), checked: false, text: "" },
        { id: Date.now() + 1, checked: false, text: "" },
      ],
      difficulty: "medium",
    },
  ]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [subjectName, setSubjectName] = useState("");
  let navigate=useNavigate();

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      questionText: "",
      answers: [
        { id: Date.now(), checked: false, text: "" },
        { id: Date.now() + 1, checked: false, text: "" },
      ],
      difficulty: "medium",
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleDeleteQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((question) => question.id !== questionId));
    }
  };

  const handleAddAnswer = (questionId) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: [
                ...question.answers,
                { id: Date.now(), checked: false, text: "" },
              ],
            }
          : question
      )
    );
  };

  const handleDeleteAnswer = (questionId, answerId) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers:
                question.answers.length > 2
                  ? question.answers.filter((answer) => answer.id !== answerId)
                  : question.answers,
            }
          : question
      )
    );
  };

  const handleCheckboxChange = (questionId, answerId) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: question.answers.map((answer) =>
                answer.id === answerId
                  ? { ...answer, checked: true }
                  : { ...answer, checked: false }
              ),
            }
          : question
      )
    );
  };

  const handleInputChange = (questionId, answerId, text) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              answers: question.answers.map((answer) =>
                answer.id === answerId ? { ...answer, text } : answer
              ),
            }
          : question
      )
    );
  };

  const handleQuestionTextChange = (questionId, text) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? { ...question, questionText: text }
          : question
      )
    );
  };

  const handleDifficultyChange = (questionId, difficulty) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? { ...question, difficulty }
          : question
      )
    );
  };

  const validateData = () => {
    for (const question of questions) {
      if (!question.questionText.trim()) {
        alert("Please fill in all question texts.");
        return false;
      }
      for (const answer of question.answers) {
        if (!answer.text.trim()) {
          alert("Please fill in all answers.");
          return false;
        }
      }
      const hasCorrectAnswer = question.answers.some((answer) => answer.checked);
      if (!hasCorrectAnswer) {
        alert("Each question must have at least one correct answer.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateData()) return;

    const formattedData = {
      name: subjectName,
      questions: questions.map((question) => ({
        question: question.questionText,
        answers: question.answers.map((answer) => ({
          answer: answer.text,
          isCorrect: answer.checked,
        })),
        difficulty: question.difficulty,
      })),
      timeLimit: timeLimit,
    };

    try {
      const response = await axios.post(
        "http://localhost:5024/api/exam/createExam",
        formattedData
      );
      console.log("Exam created successfully:", response.data);
      navigate("/examDetails");
    } catch (error) {
      console.error("Error creating exam:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h5 className="card-title mb-2">
          Subject Name
          <i
            className="fa-solid fa-star fa-xs"
            style={{ color: "#FFD43B" }}
          ></i>
        </h5>
        <TextField
          fullWidth
          id="filled-basic"
          variant="filled"
          size="small"
          label="Enter Subject Name here"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <TextField
          fullWidth
          id="time-limit"
          variant="filled"
          size="small"
          label="Time Limit (in minutes)"
          type="number"
          value={timeLimit}
          onChange={(e) => setTimeLimit(parseInt(e.target.value))}
        />
      </div>
      {questions.map((question) => (
        <div key={question.id} className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="card-title">
                Question {questions.indexOf(question) + 1}
                <i
                  className="fa-solid fa-star fa-xs"
                  style={{ color: "#FFD43B" }}
                ></i>
              </h5>
              <IconButton
                onClick={() => handleDeleteQuestion(question.id)}
                disabled={questions.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                id="filled-basic"
                variant="filled"
                size="small"
                label="Enter your question here"
                value={question.questionText}
                onChange={(e) =>
                  handleQuestionTextChange(question.id, e.target.value)
                }
              />
            </div>
            <div className="my-4">
              <FormControl fullWidth>
                <InputLabel sx={{marginBlock:'-10px'}}>Difficulty</InputLabel>
                <Select
                  value={question.difficulty}
                  onChange={(e) =>
                    handleDifficultyChange(question.id, e.target.value)
                  }
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </div>
            <h5 className="card-title">Answers</h5>
            {question.answers.map((answer) => (
              <div key={answer.id} className="d-flex align-items-center mb-2">
                <Checkbox
                  checked={answer.checked}
                  onChange={() => handleCheckboxChange(question.id, answer.id)}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={answer.text}
                  onChange={(e) =>
                    handleInputChange(question.id, answer.id, e.target.value)
                  }
                />
                {question.answers.length > 2 && (
                  <IconButton
                    onClick={() => handleDeleteAnswer(question.id, answer.id)}
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
              </div>
            ))}
            {question.answers.length < 4 && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleAddAnswer(question.id)}
              >
                Add Answer
              </Button>
            )}
          </div>
        </div>
      ))}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddQuestion}
      >
        Add Question
      </Button>
      <Button
        variant="contained"
        color="primary"
        style={{ marginLeft: "10px" }}
        onClick={handleSubmit}
      >
        Submit Exam
      </Button>
    </div>
  );
};

export default QuizComponent;