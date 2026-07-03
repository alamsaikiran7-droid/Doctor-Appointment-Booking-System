import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section
      className="py-5"
      style={{
        background: "linear-gradient(to right, #eaf4ff, #ffffff)",
      }}
    >
      <div className="container">
        <div className="row align-items-center">

          {/* Left Content */}

          <div className="col-lg-6">

            <h1
              className="display-4 fw-bold text-primary"
            >
              Your Health,
              <br />
              Our Priority
            </h1>

            <p className="lead mt-4 text-secondary">
              NovaCare Hospitals provides world-class
              healthcare with experienced doctors,
              advanced medical technology, and
              patient-centered care.
            </p>

            <div className="mt-4">

              <Link
                to="/doctors"
                className="btn btn-primary btn-lg me-3"
              >
                Book Appointment
              </Link>

              <Link
                to="/about"
                className="btn btn-outline-primary btn-lg"
              >
                Learn More
              </Link>

            </div>

          </div>

          {/* Right Image */}

          <div className="col-lg-6 text-center">

            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=700"
              alt="Doctor"
              className="img-fluid rounded-4 shadow"
            />

          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;