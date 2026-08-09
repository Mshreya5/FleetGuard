import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const roles = [
  "Fleet Manager",
  "Driver",
  "Service Center / Mechanic",
  "Admin",
];

export default function Register() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let err = {};

    if (!name.trim()) {
      err.name = "Full Name is required";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(name.trim())) {
      err.name = "Name must contain alphabets and spaces only (2-50 characters)";
    }

    if (!email.trim()) {
      err.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
      err.email = "Enter a valid RFC-compliant email address";
    }

    if (!password) {
      err.password = "Password is required";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]{8,}$/.test(password)) {
      err.password = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
    }

    if (!confirmPassword) {
      err.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (!selectedRole) {
      setErrors({ role: "Please select your role" });
      return;
    }

    if (!validate()) return;

    setLoading(true);
    const normalizedRole = selectedRole.startsWith("Service Center") ? "Service Center" : selectedRole;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          role: normalizedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrors({ server: data.message || "Registration failed. Please check your inputs." });
        setLoading(false);
        return;
      }

      setSuccessMessage("Registration successful! Redirecting to login page...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setErrors({ server: "Unable to connect to server. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#1e293b",
          borderRadius: "12px",
          border: "1px solid #334155",
          padding: "35px",
        }}
      >
        <h2
          style={{
            color: "#f1f5f9",
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "30px",
          }}
        >
          Create FleetGuard Account
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: "25px",
          }}
        >
          Select your role to register
        </p>

        <div className="login-role-grid" style={{ marginBottom: "20px" }}>
          {roles.map((role) => (
            <div
              key={role}
              onClick={() => setSelectedRole(role)}
              style={{
                cursor: "pointer",
                padding: "16px",
                borderRadius: "10px",
                textAlign: "center",
                border:
                  selectedRole === role
                    ? "2px solid #3b82f6"
                    : "1px solid #334155",
                background:
                  selectedRole === role ? "#3b82f620" : "#1e293b",
                color: "#f1f5f9",
                transition: ".25s",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {role}
            </div>
          ))}
        </div>

        {errors.role && (
          <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "15px", textAlign: "center" }}>
            {errors.role}
          </p>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: "#94a3b8", display: "block", marginBottom: "6px", fontSize: "14px" }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter full name (e.g. Alex Johnson)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
            {errors.name && <p style={errorStyle}>{errors.name}</p>}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: "#94a3b8", display: "block", marginBottom: "6px", fontSize: "14px" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: "#94a3b8", display: "block", marginBottom: "6px", fontSize: "14px" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter strong password (8+ chars, A-z, 0-9, @#$)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#94a3b8", display: "block", marginBottom: "6px", fontSize: "14px" }}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
            {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
          </div>

          {errors.server && (
            <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px", textAlign: "center" }}>
              {errors.server}
            </p>
          )}

          {successMessage && (
            <p style={{ color: "#22c55e", fontSize: "14px", marginBottom: "16px", textAlign: "center" }}>
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              background: "#3b82f6",
              color: "#f1f5f9",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              marginBottom: "20px",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div style={{ textAlign: "center", fontSize: "14px", color: "#94a3b8" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#f1f5f9",
  outline: "none",
  boxSizing: "border-box",
};

const errorStyle = {
  color: "#ef4444",
  fontSize: "13px",
  marginTop: "5px",
};
