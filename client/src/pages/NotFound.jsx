import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          <span className="text-danger">Oops!</span> Page not found.
        </p>
        <p className="lead">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <button className="btn btn-primary btn-lg" onClick={handleGoHome}>
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
