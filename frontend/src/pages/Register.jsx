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
    speciality: "",
    city: "",
    experience_years: "",
    consultation_fee: "",
    bio: "",
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

    // Backend Payload (Later)
    const registerData =
      role === "doctor"
        ? {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            speciality: formData.speciality,
            city: formData.city,
            experience_years: Number(formData.experience_years),
            consultation_fee: Number(formData.consultation_fee),
            bio: formData.bio,
            password: formData.password,
          }
        : {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          };

    console.log(registerData);

    alert(`${role} Registered Successfully`);

    navigate(`/login/${role}`);
  };

  return (
    <MainLayout>
      <div className="container py-5">

        <div className="row justify-content-center">

          <div className="col-lg-7">

            <div className="card shadow border-0 rounded-4">

              <div className="card-body p-5">

                <h2 className="text-center text-success mb-4">
                  {pageTitle}
                </h2>

                <form onSubmit={handleRegister}>

                  {/* Full Name */}

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

                  {/* Phone */}

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

                  {/* Email */}

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

                  {/* Doctor Fields */}

                  {role === "doctor" && (
                    <>

                      <div className="mb-3">
                        <label className="form-label">
                          Speciality
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          name="speciality"
                          value={formData.speciality}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          City
                        </label>

                        <select
                          className="form-select"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        >
                          <option value="">
                            Select City
                          </option>

                          <option value="Hyderabad">
                            Hyderabad
                          </option>

                          <option value="Chennai">
                            Chennai
                          </option>

                          <option value="Bangalore">
                            Bangalore
                          </option>

                          <option value="Mumbai">
                            Mumbai
                          </option>

                          <option value="Delhi">
                            Delhi
                          </option>

                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Experience (Years)
                        </label>

                        <input
                          type="number"
                          className="form-control"
                          name="experience_years"
                          value={formData.experience_years}
                          onChange={handleChange}
                          min="0"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Consultation Fee (₹)
                        </label>

                        <input
                          type="number"
                          className="form-control"
                          name="consultation_fee"
                          value={formData.consultation_fee}
                          onChange={handleChange}
                          min="0"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Bio
                        </label>

                        <textarea
                          className="form-control"
                          rows="4"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                    </>
                  )}

                  {/* Password */}

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

                  {/* Confirm Password */}

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
                    type="submit"
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