import { Link } from "react-router-dom";
import LoginRoleModal from "./LoginRoleModal";
import RegisterRoleModal from "./RegisterRoleModal";

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">

        <div className="container">

          {/* Logo */}

          <Link
            className="navbar-brand fw-bold fs-3 text-primary"
            to="/"
          >
            🏥 NovaCare Hospitals
          </Link>

          {/* Mobile Toggle */}

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}

          <div
            className="collapse navbar-collapse"
            id="navbarContent"
          >

            <ul className="navbar-nav mx-auto">

              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/"
                >
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/about"
                >
                  About Us
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/doctors"
                >
                  Doctors
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>

            </ul>

            {/* Right Side Buttons */}

            <div className="d-flex">

              <button
                className="btn btn-outline-primary me-2"
                data-bs-toggle="modal"
                data-bs-target="#loginRoleModal"
              >
                Login
              </button>

              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#registerRoleModal"
              >
                Register
              </button>

            </div>

          </div>

        </div>

      </nav>

      {/* Role Selection Modals */}

      <LoginRoleModal />

      <RegisterRoleModal />

    </>
  );
}

export default Navbar;