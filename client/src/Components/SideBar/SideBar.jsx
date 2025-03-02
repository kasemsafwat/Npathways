import React from 'react'
import "./SideBar.css"
import userAvatar from "../../assets/user.png";
import SingleExam from '../SingleExam/SingleExam';


export default function SideBar() {
  return (
    <>
      {/* Main Content and Static Sidebar */}

        {/* Static Sidebar on the Right */}
        <div className="sidebar h-100">
          <div className="sidebar-header d-flex align-items-center mb-4 justify-content-around">
            <h5 className="sidebar-title mb-0 me-3">kasem safwat</h5>{" "}
            {/* Add margin to the right of the text */}
            <img
              src={userAvatar}
              alt="My Image"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
              className="my-image"
            />
          </div>
          <div className="sidebar-body ">
            <ul className="navbar-nav gap-2 ">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Exams
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Add Exam
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        </div>

    </>
  );
}
