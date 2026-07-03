import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function Register() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    specialization: "",
    password: "",
    confirmPassword: "",
  });

  const pageTitle =
    role.charAt(0).toUpperCase() + role.slice(1) + " Registration";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert(`${role} Registered Successfully`);

    navigate(`/login/${role}`);
  };

  return (
    <MainLayout>
      <div className="container py-5">

        <div className="row justify-content-center">

          <div className="col-md-6">

            <div className="card shadow">

              <div className="card-body p-4">

                <h2 className="text-center text-success mb-4">
                  {pageTitle}
                </h2>

                <form onSubmit={handleRegister}>

                  <div className="mb-3">
                    <label className="form-label">
                      Full Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  {role === "doctor" && (
                    <div className="mb-3">
                      <label className="form-label">
                        Specialization
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">
                      Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    className="btn btn-success w-100"
                  >
                    Register
                  </button>

                </form>

                <div className="text-center mt-3">

                  <small>

                    Already have an account?

                    <Link to={`/login/${role}`}>
                      {" "}
                      Login Here
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

export default Register;