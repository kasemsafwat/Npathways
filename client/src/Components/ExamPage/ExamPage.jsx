import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import SingleExam from "../SingleExam/SingleExam";
import axios from "axios";

export default function ExamPage() {
  const [exams, setExams] = useState([]);

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

  return (
    <>
      <div className="">
        <div className="position-fixed w-100 top-0 z-3">
          <NavBar />
        </div>

        {/* Main Content and Sidebar */}
        <div className="container-fluid" style={{ marginTop: "56px" }}>
          <div className="row">
            {/* Main Content (Exams) */}
            <div className="col-md-10 col-8">
              <div className="row justify-content-center">
                {exams.map((exam, index) => (
                  <div key={index} className="col-12 col-md-6 col-lg-3 mb-4">
                    <SingleExam
                      exam = {exam}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div
              className="col-md-2 col-4 position-fixed end-0 vh-100 "
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
