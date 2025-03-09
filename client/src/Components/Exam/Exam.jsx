import React, { useEffect, useState } from "react";
import SideBar from "../SideBar/SideBar";
import axios from "axios";

export default function Exam() {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [timeLeft, setTimeLeft] = useState(0); 

  async function getQuestion() {
    try {
      const { data } = await axios.get(
        `http://localhost:5024/api/exam/67c4e7eeef76b6cdb876290c`
      );
      setExam(data); 
      setTimeLeft(data.timeLimit * 60); 
      setLoading(false); 
    } catch (error) {
      setLoading(false);
    }
  }

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Format timeLeft into minutes and seconds
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    getQuestion();
  }, []);

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (!exam) {
    return <p>No exam data found.</p>; 
  }

  return (
    <>
      <div className="position-fixed w-100 top-0 z-3">
        <NavBar />
      </div>

      <div className="container mx-auto" style={{ marginTop: "56px" }}>
        <div className="row">
          <div className="d-flex mt-5 justify-content-around">
            <h2>{exam.name || "Exam Title"}</h2>
            <p className=" fs-3">
              <i className="fa-solid fa-clock" style={{ color: "#127acd" }}></i>{" "}
              Time: {formatTime(timeLeft)}
            </p>
          </div>

          <div className="container mt-5">
            <div className="card mx-5">
              {exam.questions.map((question, index) => (
                <div key={index} className="card-body">
                  <h5 className="card-title">Question {index + 1}</h5>
                  <p className="card-text">{question.question}</p>
                  {question.answers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`options-${index}`} 
                        id={`option-${index}-${answerIndex}`}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`option-${index}-${answerIndex}`}
                      >
                        {answer.answer}
                      </label>
                    </div>
                  ))}
                  <hr />
                </div>
              ))}
              <div className="d-flex justify-content-between m-3">
                <button type="button" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
            {/* Sidebar */}
            <div
              className="col-md-2 col-4 position-fixed end-0 vh-100"
              style={{ top: "56px", zIndex: 2, padding: 0 }}
            >
              <SideBar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
