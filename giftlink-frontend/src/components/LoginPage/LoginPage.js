import React, { useState,useEffect } from 'react';
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  //insert code here to create useState hook variables for email, password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn } = useAppContext();
  const bearerToken = sessionStorage.getItem("bearer-token");
  const [incorrect, setIncorrect] = useState("");
  const [showerr, setShowerr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("auth-token")) {
      navigate("/app");
    }
  }, [navigate]);
  // insert code here to create handleLogin function and include console.log
  const handleLogin = async () => {
    const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
      //Step 1 - Task 6
      method: "POST",
      //Step 1 - Task 7
      headers: {
        "content-type": "application/json",
        Authorization: bearerToken ? `Bearer ${bearerToken}` : "", // Include Bearer token if available
      },
      //Step 1 - Task 8
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    //Step 2 - Task 1
    const json = await response.json();
    console.log("json data", json);

    //Step 2 - Task 2
    if (json.authtoken) {
      sessionStorage.setItem("auth-token", json.authtoken);
      sessionStorage.setItem("name", json.firstName);
      sessionStorage.setItem("email", json.email);
      //Step 2 - Task 3
      setIsLoggedIn(true);
      //Step 2 - Task 4
      navigate("/app");
    } else {
      //Step 2: Task 5
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      setIncorrect("Wrong user or password. Try again.");
      setTimeout(() => {
        setIncorrect("");
      }, 2000);
    }
    if (json.error) {
      //Step 2 - Task 5
      setShowerr(json.error);
    }
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Login</h2>

            {/* insert code here to create input elements for the variables email and  password */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="text"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                style={{
                  color: "red",
                  height: ".5cm",
                  display: "block",
                  fontStyle: "italic",
                  fontSize: "12px",
                }}
              >
                {incorrect}
              </span>
            </div>
            <div className="text-danger">{showerr}</div>

            {/* insert code here to create a button that performs the `handleLogin` function on click */}
            <button
              className="btn btn-primary w-100 mb-3"
              onClick={handleLogin}
            >
              Login
            </button>
            <p className="mt-4 text-center">
              New here?{" "}
              <a href="/app/register" className="text-primary">
                Register Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
