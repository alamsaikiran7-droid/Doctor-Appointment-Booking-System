import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import MainLayout from "../layouts/MainLayout";

function NotFound() {
  return (
    <MainLayout>
      <div className="container-nc py-32 text-center">
        <p className="font-mono text-primary text-sm mb-3">Error 404</p>
        <h1 className="text-4xl font-display mb-4">This page took a wrong turn.</h1>
        <p className="text-muted mb-8">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn-primary inline-flex">
          <FiArrowLeft size={15} /> Back to Home
        </Link>
      </div>
    </MainLayout>
  );
}

export default NotFound;
