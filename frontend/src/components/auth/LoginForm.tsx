import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login({ email, password });
  };
  return (
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
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
