import React from "react";
import examimage from "../../assets/Rectangle 72.png";

export default function SingleExam({ exam }) {
  return (
    <>
      <div className="container" style={{ marginTop: "56px" }}>
        <div className="card">
          <img src={examimage} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{exam.name}</h5>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the content.
            </p>
            <p className="card-text">{exam.timeLimit} min</p>
            <a href="#" className="btn btn-primary">
              Go To Exam
            </a>
          </div>

          {/* Add more cards as needed */}
        </div>
      </div>
    </>
  );
}
