import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionExpired = searchParams.get("expired") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      const response = await fetch(
        "/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      if (!data.token) {
        setError("Login failed. No authentication token was returned.");
        return;
      }

      localStorage.setItem("token", data.token);

      window.dispatchEvent(new Event("login"));

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <section className="auth-section">
      <h2>Login to EventBook</h2>

      {sessionExpired && (
        <p className="session-expired">
          Your session has expired. Please log in again.
        </p>
      )}

      {error && (
        <p className="login-error">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </section>
  );
}

export default Login;