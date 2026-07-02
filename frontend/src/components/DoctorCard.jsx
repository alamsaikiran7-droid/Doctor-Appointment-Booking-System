function DoctorCard({
  name,
  specialization,
  clinic,
  city,
  fee,
  experience,
  rating,
  image,
}) {
  return (
    <div className="card shadow h-100">

      <img
        src={image}
        className="card-img-top"
        alt={name}
      />

      <div className="card-body">

        <h5 className="card-title">{name}</h5>

        <p>
          <strong>Specialization:</strong> {specialization}
        </p>

        <p>
          <strong>Clinic:</strong> {clinic}
        </p>

        <p>
          <strong>City:</strong> {city}
        </p>

        <p>
          <strong>Experience:</strong> {experience} Years
        </p>

        <p>
          <strong>Consultation Fee:</strong> ₹{fee}
        </p>

        <p>
          <strong>Rating:</strong> ⭐ {rating}
        </p>

        <button className="btn btn-primary w-100">
          View Profile
        </button>

      </div>

    </div>
  );
}

export default DoctorCard;