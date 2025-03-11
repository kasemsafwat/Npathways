import React, { useEffect, useState } from "react";
// import NavBar from "../NavBar/NavBar";
// import SideBar from "../SideBar/SideBar";
import axios from "axios";
import "./ExamPage.css";
import { Link, useNavigate } from "react-router-dom";

export default function ExamPage() {
  const [exams, setExams] = useState([]);
  let navigate = useNavigate();
  function handleCreateExam() {
    navigate("/createExam");
  }
  function handleEditExam(examId) {
    navigate(`/createExam/${examId}`);
  }
  async function getExams() {
    try {
      const response = await axios.get(`http://localhost:5024/api/exam/`);
      console.log(response);
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  }

  useEffect(() => {
    getExams();
  }, []);
  async function deleteExam(examId) {
    try {
      const response = await axios.delete(
        `http://localhost:5024/api/exam/deleteExam/${examId}`
      );
      console.log("Exam deleted successfully:", response.data);
      getExams();
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  }
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="">Exams</h1>
        <button className="plus" onClick={handleCreateExam}>
          <i className="fa-solid fa-plus fa-lg"></i> Create Exam
        </button>
      </div>
      <div className="row">
        <div className="mt-5 shadow-sm p-3 mb-5 bg-white rounded-4">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Exam Name</th>
                <th scope="col">Duration</th>
                <th scope="col">Question</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => (
                <tr key={index}>
                  <td>
                    <Link
                      to={`/exam/${exam._id}`}
                      className="text-decoration-none text-dark"
                    >
                      {exam.name}{" "}
                    </Link>
                  </td>
                  <td>{exam.timeLimit} Min</td>
                  <td>{exam.questions.length}</td>
                  <td>
                    <i
                      className="fa-solid fa-pen-to-square fa-lg"
                      style={{ color: "#5a57ff", cursor: "pointer" }}
                      onClick={() => handleEditExam(exam._id)}
                    ></i>
                  </td>
                  <td>
                    <i
                      className="fa-solid fa-trash-can fa-lg"
                      style={{ color: "#5a57ff" }}
                      onClick={() => deleteExam(exam._id)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}