import React, { useState, useEffect } from "react";

function Account() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data when the component mounts
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch("http://127.0.0.1:5555/users/4", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      console.log("response ---------",response);
      const userData = response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div style={{ marginLeft: "30px" }}>
      <h2>My Account</h2>
      {user && (
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src="https://static.wikia.nocookie.net/26e0b874-613b-4136-8f13-453f2ea74af2/scale-to-width/755"
              alt="Profile Photo"
              style={{ width: "200px", height: "auto" }}
            />
          </div>
          <br />
          <div style={{ marginLeft: "20px", marginTop: "10px" }}>
            <p style={{ fontFamily: "Arial, sans-serif", color: "darkslategray" }}>Username:</p>
            <p style={{ textIndent: "90px" }}>{user.username}</p>
          </div>
          <div style={{ marginLeft: "20px", marginTop: "10px" }}>
            <p style={{ fontFamily: "Arial, sans-serif", color: "darkslategray" }}>First Name:</p>
            <p style={{ textIndent: "90px" }}>{user.firstname}</p>
          </div>
          <div style={{ marginLeft: "20px", marginTop: "10px" }}>
            <p style={{ fontFamily: "Arial, sans-serif", color: "darkslategray" }}>Last Name:</p>
            <p style={{ textIndent: "90px" }}>{user.lastname}</p>
          </div>
          <div style={{ marginLeft: "20px", marginTop: "10px" }}>
            <p style={{ fontFamily: "Arial, sans-serif", color: "darkslategray" }}>About Me:</p>
            <p style={{ textIndent: "90px" }}>{user.bio}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;