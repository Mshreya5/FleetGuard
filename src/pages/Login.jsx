import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Login.css';

const roles = [
  "Fleet Manager",
  "Driver",
  "Service Center / Mechanic",
  "Admin",
];

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [selectedRole, setSelectedRole] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const [showForgot, setShowForgot] = useState(false);
  const [showChange, setShowChange] = useState(false);

  const validate = () => {
    let err = {};

    if (!email.trim()) {
      err.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      err.email = "Enter a valid email";
    }

    if (!password) {
      err.password = "Password is required";
    } else if (password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!selectedRole) {
      setErrors({ role: "Please select a role" });
      return;
    }

    if (!validate()) return;

    const normalizedRole = selectedRole.startsWith("Service Center") ? "Service Center" : selectedRole;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          role: normalizedRole
        })
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrors({ server: data.message || "Invalid credentials or unauthorized role access." });
        return;
      }

      if (data && data.token && auth && auth.login) {
        auth.login(data.token, data.user || { email: email.trim(), role: normalizedRole });
      } else if (data && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || { email: email.trim(), role: normalizedRole }));
      }

      switch (selectedRole) {
        case "Fleet Manager":
          navigate("/fleetmanager/dashboard");
          break;

        case "Driver":
          navigate("/driver/dashboard");
          break;

        case "Service Center / Mechanic":
        case "Service Center":
          navigate("/servicecenter/dashboard");
          break;

        case "Admin":
          navigate("/admin/dashboard");
          break;

        default:
          break;
      }
    } catch (err) {
      setErrors({ server: "Unable to connect to FleetGuard server. Please try again." });
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
          maxWidth: "500px",
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
          FleetGuard Login
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          Select your role to continue
        </p>

        <div className="login-role-grid">
          {roles.map((role) => (
            <div
              key={role}
              onClick={() => setSelectedRole(role)}
              style={{
                cursor: "pointer",
                padding: "18px",
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
              }}
            >
              {role}
            </div>
          ))}
        </div>

        {selectedRole && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  color: "#94a3b8",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "#f1f5f9",
                  outline: "none",
                }}
              />

              {errors.email && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "13px",
                    marginTop: "6px",
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  color: "#94a3b8",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "#f1f5f9",
                  outline: "none",
                }}
              />

              {errors.password && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "13px",
                    marginTop: "6px",
                  }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            {errors.server && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "14px",
                  marginBottom: "14px",
                  textAlign: "center",
                }}
              >
                {errors.server}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                background: "#3b82f6",
                color: "#f1f5f9",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: "20px",
              }}
            >
              Login
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
              }}
            >
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  cursor: "pointer",
                }}
              >
                Forgot Password?
              </button>

              <Link
                to="/register"
                style={{
                  color: "#3b82f6",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Register Account
              </Link>
            </div>
          </form>
        )}

        {showForgot && (
          <ForgotPassword
            close={() => setShowForgot(false)}
          />
        )}

        {showChange && (
          <ChangePassword
            close={() => setShowChange(false)}
          />
        )}
      </div>
    </div>
  );
}


/* ---------------- FORGOT PASSWORD UI ---------------- */

function ForgotPassword({ close }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submitForgot = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Enter a valid email address");
      return;
    }

    setMessage(
      "Password reset request submitted successfully"
    );
  };

  return (
    <div
      style={{
        marginTop: "25px",
        padding: "20px",
        background: "#0f172a",
        borderRadius: "12px",
        border: "1px solid #334155",
      }}
    >
      <h3
        style={{
          color: "#f1f5f9",
          marginBottom: "15px",
        }}
      >
        Forgot Password
      </h3>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          background: "#1e293b",
          border: "1px solid #334155",
          color: "#f1f5f9",
          marginBottom: "15px",
        }}
      />

      <button
        onClick={submitForgot}
        style={{
          width: "100%",
          padding: "12px",
          background: "#3b82f6",
          color: "#f1f5f9",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>

      {message && (
        <p
          style={{
            color: message.includes("success")
              ? "#22c55e"
              : "#ef4444",
            marginTop: "12px",
            fontSize: "14px",
          }}
        >
          {message}
        </p>
      )}

      <button
        onClick={close}
        style={{
          marginTop: "12px",
          background: "transparent",
          border: "none",
          color: "#94a3b8",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
}


/* ---------------- CHANGE PASSWORD UI ---------------- */

function ChangePassword({ close }) {
  const [current, setCurrent] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [message, setMessage] = useState("");

  const submitChange = () => {

    if (newPassword.length < 6) {
      setMessage(
        "Password must contain minimum 6 characters"
      );
      return;
    }

    if (newPassword !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    setMessage(
      "Password changed successfully"
    );
  };


  return (
    <div
      style={{
        marginTop: "25px",
        padding: "20px",
        background: "#0f172a",
        borderRadius: "12px",
        border: "1px solid #334155",
      }}
    >

      <h3
        style={{
          color:"#f1f5f9",
          marginBottom:"15px"
        }}
      >
        Change Password
      </h3>


      <input
        type="password"
        placeholder="Current Password"
        value={current}
        onChange={(e)=>setCurrent(e.target.value)}
        style={inputStyle}
      />


      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e)=>setNewPassword(e.target.value)}
        style={inputStyle}
      />


      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e)=>setConfirm(e.target.value)}
        style={inputStyle}
      />


      <button
        onClick={submitChange}
        style={{
          width:"100%",
          padding:"12px",
          background:"#3b82f6",
          color:"#f1f5f9",
          border:"none",
          borderRadius:"10px",
          cursor:"pointer"
        }}
      >
        Update Password
      </button>


      {message && (
        <p
          style={{
            marginTop:"12px",
            color:message.includes("success")
            ? "#22c55e"
            : "#ef4444"
          }}
        >
          {message}
        </p>
      )}


      <button
        onClick={close}
        style={{
          marginTop:"12px",
          background:"transparent",
          border:"none",
          color:"#94a3b8",
          cursor:"pointer"
        }}
      >
        Close
      </button>

    </div>
  );
}


const inputStyle = {
  width:"100%",
  padding:"12px",
  marginBottom:"12px",
  borderRadius:"10px",
  background:"#1e293b",
  border:"1px solid #334155",
  color:"#f1f5f9"
};