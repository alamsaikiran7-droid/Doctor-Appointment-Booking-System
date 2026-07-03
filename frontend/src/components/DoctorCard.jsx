import { Link } from "react-router-dom";

function DoctorCard({
  id,
  name,
  email,
  phone,
  speciality,
  city,
  consultation_fee,
  experience_years,
  bio,
  image,
  rating,
}) {
  return (
    <div className="card shadow-sm h-100 border-0 rounded-4">

      {/* Doctor Image */}

      <img
        src={image}
        className="card-img-top"
        alt={name}
        style={{
          height: "250px",
          objectFit: "cover",
        }}
      />

      <div className="card-body">

        {/* Doctor Name */}

        <h5 className="card-title fw-bold text-primary">
          {name}
        </h5>

        {/* Speciality */}

        <p className="mb-2">
          <strong>Speciality:</strong> {speciality}
        </p>

        {/* City */}

        <p className="mb-2">
          <strong>City:</strong> {city}
        </p>

        {/* Experience */}

        <p className="mb-2">
          <strong>Experience:</strong> {experience_years} Years
        </p>

        {/* Consultation Fee */}

        <p className="mb-2">
          <strong>Consultation Fee:</strong> ₹{consultation_fee}
        </p>

        {/* Phone */}

        <p className="mb-2">
          <strong>Phone:</strong> {phone}
        </p>

        {/* Email */}

        <p className="mb-2">
          <strong>Email:</strong> {email}
        </p>

        {/* Rating */}

        <p className="mb-3">
          <strong>Rating:</strong> ⭐ {rating}
        </p>

        {/* Bio */}

        {bio && (
          <p
            className="text-muted"
            style={{
              fontSize: "14px",
            }}
          >
            {bio}
          </p>
        )}

      </div>

      <div className="card-footer bg-white border-0">

        <Link
          to={`/doctor-profile/${id}`}
          className="btn btn-primary w-100"
        >
          View Profile
        </Link>

      </div>

    </div>
  );
}

export default DoctorCard;