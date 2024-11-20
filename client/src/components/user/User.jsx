import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import validator from "validator";
import "./user.css";

export default function UserForm({ type }) {
  const { signUp, logIn, error, loading } = useUser();
  const navigate = useNavigate();
  const title = type === "login" ? "Log in" : "Sign up";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [confirmPassError, setConfirmPassError] = useState(null);

  const changeData = (key, value) => setFormData((curr) => ({ ...curr, [key]: value }));

  const signUser = (e) => {
    e.preventDefault();
    setConfirmPassError(null);

    const { username, email, password, confirmPassword } = formData;

    if (type === "login") {
      logIn(email, password)
        .then(() => navigate("/"))
        .catch(() => {});
    } else {
      if (password !== confirmPassword) {
        setConfirmPassError("Passwords do not match.");
        return;
      }

      if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 2,
      })) {
        setConfirmPassError("Your password should be stronger.");
        return;
      }

      signUp(username, email, password)
        .then(() => navigate("/"))
        .catch(() => {});
    }
  };

  return (
    <div className="user-form-container">
      <form onSubmit={signUser}>
        <h1>{title}</h1>
        {type === "signup" && (
          <div className="form-div">
            <label>Username</label>
            <input
              onChange={(e) => changeData("username", e.target.value)}
              value={formData.username}
              required
              type="text"
            />
          </div>
        )}
        <div className="form-div">
          <label>Email</label>
          <input
            onChange={(e) => changeData("email", e.target.value)}
            value={formData.email}
            required
            type="email"
          />
        </div>
        <div className="form-div">
          <label>Password</label>
          <input
            onChange={(e) => changeData("password", e.target.value)}
            value={formData.password}
            required
            type="password"
          />
          {type === "login" && (
            <p className="no-account">
              Don't have an account? <Link to="/signup">SignUp</Link>
            </p>
          )}
        </div>
        {type === "signup" && (
          <div className="form-div">
            <label>Confirm Password</label>
            <input
              onChange={(e) => changeData("confirmPassword", e.target.value)}
              value={formData.confirmPassword}
              required
              type="password"
            />
            {confirmPassError && (
              <div className="error-dont-match">{confirmPassError}</div>
            )}
          </div>
        )}
        <button className="signup-btn" disabled={loading}>
          {title}
        </button>
      </form>
      {error && <div className="error-dont-match">{error}</div>}
    </div>
  );
}
