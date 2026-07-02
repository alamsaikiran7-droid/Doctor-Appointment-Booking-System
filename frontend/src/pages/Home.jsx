import MainLayout from "../layouts/MainLayout";
import Hero from "../components/Hero";
import DoctorCard from "../components/DoctorCard";
import Features from "../components/Features";
import doctors from "../data/doctors";
import { Link } from "react-router-dom";

function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <Hero />

      {/* Featured Doctors */}
      <h2 className="mt-5 mb-4 text-center">
        Featured Doctors
      </h2>

      <div className="row">
        {doctors.slice(0, 3).map((doctor) => (
          <div
            className="col-md-4 mb-4"
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
        ))}
      </div>

      {/* View All Doctors Button */}
      <div className="text-center mb-5">
        <Link
          to="/doctors"
          className="btn btn-primary btn-lg"
        >
          View All Doctors
        </Link>
      </div>

      {/* Features Section */}
      <Features />
    </MainLayout>
  );
}

export default Home;