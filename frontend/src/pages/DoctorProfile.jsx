import { Link, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import doctors from "../data/doctors";

function DoctorProfile() {

  // Get Doctor ID from URL
  const { id } = useParams();

  // Find Doctor
  const doctor = doctors.find(
    (doc) => doc.id === Number(id)
  );

  // Doctor Not Found
  if (!doctor) {
    return (
      <MainLayout>
        <div className="container mt-5 text-center">
          <h2>Doctor Not Found</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="container mt-5">

        <div className="card shadow border-0 rounded-4">

          <div className="row g-0">

            {/* Doctor Image */}

            <div className="col-md-4 text-center p-4">

              <img
                src={doctor.image}
                alt={doctor.name}
                className="img-fluid rounded-4 shadow"
                style={{
                  maxHeight: "350px",
                  objectFit: "cover",
                }}
              />

            </div>

            {/* Doctor Details */}

            <div className="col-md-8">

              <div className="card-body p-4">

                <h2 className="fw-bold text-primary">
                  {doctor.name}
                </h2>

                <h5 className="text-success mb-4">
                  {doctor.speciality}
                </h5>

                <hr />

                <p>
                  <strong>Email :</strong>{" "}
                  {doctor.email}
                </p>

                <p>
                  <strong>Phone :</strong>{" "}
                  {doctor.phone}
                </p>

                <p>
                  <strong>City :</strong>{" "}
                  {doctor.city}
                </p>

                <p>
                  <strong>Experience :</strong>{" "}
                  {doctor.experience_years} Years
                </p>

                <p>
                  <strong>Consultation Fee :</strong>{" "}
                  ₹{doctor.consultation_fee}
                </p>

                <p>
                  <strong>Rating :</strong>{" "}
                  ⭐ {doctor.rating}
                </p>

                <p>
                  <strong>About Doctor :</strong>
                </p>

                <p className="text-muted">
                  {doctor.bio}
                </p>

                <div className="mt-4">

                  <Link
                    to={`/booking/${doctor.id}`}
                    className="btn btn-success me-3"
                  >
                    Book Appointment
                  </Link>

                  <Link
                    to="/doctors"
                    className="btn btn-outline-secondary"
                  >
                    Back to Doctors
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default DoctorProfile;