import React, { useState } from "react";
import { TextField, Checkbox, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

const QuizComponent = () => {
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      questionText: "",
      answers: [
        { id: Date.now(), checked: false, text: "" },
        { id: Date.now() + 1, checked: false, text: "" },
      ],
    },
  ]);

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(), // Unique ID for the new question
      questionText: "",
      answers: [
        { id: Date.now(), checked: false, text: "" },
        { id: Date.now() + 1, checked: false, text: "" },
      ],
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
    </div>
  );
};

export default QuizComponent;