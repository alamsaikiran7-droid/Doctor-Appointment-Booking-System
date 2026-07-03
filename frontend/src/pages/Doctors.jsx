import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import DoctorCard from "../components/DoctorCard";
import doctors from "../data/doctors";

function Doctors() {

  // ==========================
  // State Variables
  // ==========================

  const [searchTerm, setSearchTerm] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [city, setCity] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // ==========================
  // Copy Doctor Array
  // ==========================

  let filteredDoctors = [...doctors];

  // ==========================
  // Search by Doctor Name
  // ==========================

  filteredDoctors = filteredDoctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==========================
  // Filter by Speciality
  // ==========================

  if (speciality !== "") {
    filteredDoctors = filteredDoctors.filter(
      (doctor) => doctor.speciality === speciality
    );
  }

  // ==========================
  // Filter by City
  // ==========================

  if (city !== "") {
    filteredDoctors = filteredDoctors.filter(
      (doctor) => doctor.city === city
    );
  }

  // ==========================
  // Sort by Consultation Fee
  // ==========================

  if (sortOrder === "low") {
    filteredDoctors.sort(
      (a, b) => a.consultation_fee - b.consultation_fee
    );
  }

  if (sortOrder === "high") {
    filteredDoctors.sort(
      (a, b) => b.consultation_fee - a.consultation_fee
    );
  }

  // ==========================
  // Clear Filters
  // ==========================

  const clearFilters = () => {
    setSearchTerm("");
    setSpeciality("");
    setCity("");
    setSortOrder("");
  };

  return (
    <MainLayout>

      <div className="container mt-4">

        <h2 className="text-center mb-4">
          Our Doctors
        </h2>

        {/* ==========================
            Filters
        ========================== */}

        <div className="row mb-4">

          {/* Search */}

          <div className="col-md-3">

            <label className="form-label">
              Search Doctor
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Search Doctor..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

          {/* Speciality */}

          <div className="col-md-3">

            <label className="form-label">
              Speciality
            </label>

            <select
              className="form-select"
              value={speciality}
              onChange={(e) =>
                setSpeciality(e.target.value)
              }
            >

              <option value="">
                All
              </option>

              <option value="Dentist">
                Dentist
              </option>

              <option value="Cardiologist">
                Cardiologist
              </option>

              <option value="General Physician">
                General Physician
              </option>

              <option value="General Surgeon">
                General Surgeon
              </option>

              <option value="Orthopaedic Surgeon">
                Orthopaedic Surgeon
              </option>

              <option value="Ophthalmologist">
                Ophthalmologist
              </option>

              <option value="Urologist">
                Urologist
              </option>

              <option value="Obstetrician & Gynecologist">
                Obstetrician & Gynecologist
              </option>

              <option value="General Medicine & Geriatrics Physician">
                General Medicine & Geriatrics Physician
              </option>

            </select>

          </div>

          {/* City */}

          <div className="col-md-3">

            <label className="form-label">
              City
            </label>

            <select
              className="form-select"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
            >

              <option value="">
                All Cities
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

            </select>

          </div>

          {/* Sort */}

          <div className="col-md-3">

            <label className="form-label">
              Sort By Fee
            </label>

            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value)
              }
            >

              <option value="">
                Default
              </option>

              <option value="low">
                Fee: Low to High
              </option>

              <option value="high">
                Fee: High to Low
              </option>

            </select>

          </div>

        </div>

        {/* Clear Filters */}

        <div className="row mb-4">

          <div className="col-md-3">

            <button
              className="btn btn-danger w-100"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>

        </div>

        {/* ==========================
            Doctor Cards
        ========================== */}

        <div className="row">

          {filteredDoctors.length > 0 ? (

            filteredDoctors.map((doctor) => (

              <div
                className="col-lg-4 col-md-6 mb-4"
                key={doctor.id}
              >

                <DoctorCard
                  id={doctor.id}
                  name={doctor.name}
                  email={doctor.email}
                  phone={doctor.phone}
                  speciality={doctor.speciality}
                  city={doctor.city}
                  consultation_fee={doctor.consultation_fee}
                  experience_years={doctor.experience_years}
                  bio={doctor.bio}
                  rating={doctor.rating}
                  image={doctor.image}
                />

              </div>

            ))

          ) : (

            <div className="text-center mt-5">

              <h4>No Doctors Found</h4>

              <p>
                Try changing your search or filters.
              </p>

            </div>

          )}

        </div>

      </div>

    </MainLayout>
  );
}

export default Doctors;