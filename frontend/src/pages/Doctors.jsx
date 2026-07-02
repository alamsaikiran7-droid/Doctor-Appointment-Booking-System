import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import DoctorCard from "../components/DoctorCard";
import doctors from "../data/doctors";

function Doctors() {
  // ==========================
  // State Variables
  // ==========================
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");
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
  // Filter by Specialization
  // ==========================
  if (specialization !== "") {
    filteredDoctors = filteredDoctors.filter(
      (doctor) => doctor.specialization === specialization
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
    filteredDoctors.sort((a, b) => a.fee - b.fee);
  }

  if (sortOrder === "high") {
    filteredDoctors.sort((a, b) => b.fee - a.fee);
  }
  const clearFilters = () => {
    setSearchTerm("");
    setSpecialization("");
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
            Filters Section
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
              placeholder="Search doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>

          {/* Specialization */}

          <div className="col-md-3">

            <label className="form-label">
              Specialization
            </label>

            <select
              className="form-select"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >

              <option value="">All</option>

              <option value="Dentist">Dentist</option>

              <option value="Cardiologist">Cardiologist</option>

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
              onChange={(e) => setCity(e.target.value)}
            >

              <option value="">All Cities</option>

              <option value="Hyderabad">Hyderabad</option>

              <option value="Chennai">Chennai</option>

              <option value="Bangalore">Bangalore</option>

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
              onChange={(e) => setSortOrder(e.target.value)}
            >

              <option value="">Default</option>

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

         <div className="col-md-3 d-flex align-items-end">

          <button
            className="btn btn-danger w-100"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

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
                 name={doctor.name}
                 specialization={doctor.specialization}
                 clinic={doctor.clinic}
                 city={doctor.city}
                 fee={doctor.fee}
                 experience={doctor.experience}
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