import React from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import SingleExam from "../SingleExam/SingleExam";

export default function ExamPage() {
   const exams = Array.from({ length: 8 }, (_, index) => index + 1);
  return (
    <>
      <div className="">
        {/* NavBar */}
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
                      title={exam.title}
                      description={exam.description}
                      image={exam.image}
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
