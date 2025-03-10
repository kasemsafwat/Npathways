import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserProfile = () => {
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5024/api/user/${userId}`,
          { withCredentials: true }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;
  if (!userData)
    return <div className="text-center mt-5">No user data found.</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">User Profile</h3>

              {/* Avatar Section */}
              <div className="text-center mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random&size=150`}
                  alt="User Avatar"
                  className="rounded-circle"
                  style={{ width: "150px", height: "150px" }}
                />
                <div className="mt-3">
                  <button className="btn btn-outline-primary btn-sm me-2">
                    Upload New Photo
                  </button>
                  <button className="btn btn-outline-danger btn-sm">
                    Delete
                  </button>
                </div>
              </div>

              {/* User Details */}
              <div className="mb-3">
                <label className="form-label fw-bold">First Name</label>
                <p>{userData.firstName}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Last Name</label>
                <p>{userData.lastName}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <p>{userData.email}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Track</label>
                <p>{userData.track}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Level</label>
                <p>{userData.level}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Status</label>
                <p
                  className={
                    userData.status === "active"
                      ? "text-success fw-bold"
                      : "text-danger fw-bold"
                  }
                >
                  {userData.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
