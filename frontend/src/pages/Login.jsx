import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function Login() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const pageTitle =
    role.charAt(0).toUpperCase() + role.slice(1) + " Login";

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary Login
    // Later replace with API

    localStorage.setItem("userRole", role);

    if (role === "patient") {
      navigate("/patient/dashboard");
    }

    if (role === "doctor") {
      navigate("/doctor/dashboard");
    }

    if (role === "admin") {
      navigate("/admin/dashboard");
    }
  };

  return (
    <MainLayout>
      <div className="container py-5">

        <div className="row justify-content-center">

          <div className="col-md-5">

            <div className="card shadow">

              <div className="card-body p-4">

                <h2 className="text-center text-primary mb-4">
                  {pageTitle}
                </h2>

                <form onSubmit={handleLogin}>

                  <div className="mb-3">

                    <label className="form-label">
                      Username
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Phone or Email"
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value)
                      }
                      required
                    />

                  </div>

                  <div className="mb-3">

                    <label className="form-label">
                      Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                    />

                  </div>

                  <button
                    className="btn btn-primary w-100"
                  >
                    Login
                  </button>

                </form>

                <div className="text-center mt-3">

                  <small>

                    New User?

                    <Link
                      to={`/register/${role}`}
                    >
                      {" "}
                      Register Here
                    </Link>

                  </small>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Login;