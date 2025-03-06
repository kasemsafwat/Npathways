import React from 'react'
import NavBar from '../NavBar/NavBar'

export default function FinishedExam() {
  return (
    <>
      <NavBar></NavBar>
      <div className="d-flex justify-content-center my-5">
        <div className="text-center">
          <div className='mb-5'>
            <i
              className="fa-regular fa-circle-check"
              style={{ color: "#1591f3", fontSize: "150px" }}
            ></i>
          </div>
          <h1 className="display-4">Thank You </h1>
          <p className="lead">Your Finished Your Exam</p>
          <p>Your admin will release your results shortly, All the best :)</p>
        </div>
      </div>
    </>
  );
}
