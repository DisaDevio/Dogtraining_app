import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Activities from "./components/Activities";
import MapComponent from "./components/Map";
import ActivityDetails from "./components/ActivityDetails";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5001/api/check_login");
        const data = await response.json();
        setLoggedIn(data.logged_in);
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setLoggedIn(true);
      } else {
        const data = await response.json();
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred during login.");
    }
  };

  return (
    <Router>
      {loggedIn ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jaktdagbok/*" element={<Activities />} />
          <Route path="/map" element={<MapComponent />} />
          <Route path="/activity/:id" element={<ActivityDetails />} />
        </Routes>
      ) : (
        <div className="image-container">
          <img
            className="img"
            src="/background.png"
            alt="Hertha running"
            style={{
              position: "absolute",
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              borderRadius: "10px",
              zIndex: 0,
              top: 0,
              left: 0,
            }}
          />

          <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
              <h2>Login to Garmin Connect</h2>
              {error && <p className="error">{error}</p>}
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
