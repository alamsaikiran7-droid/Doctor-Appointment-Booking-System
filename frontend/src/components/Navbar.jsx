import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">

                <Link className="navbar-brand" to="/">
                    Doctor Booking
                </Link>

                <div className="navbar-nav ms-auto">

                    <Link className="nav-link" to="/">
                        Home
                    </Link>

                    <Link className="nav-link" to="/login">
                        Login
                    </Link>
                    
                    <Link className="nav-link" to="/doctors">    
                        Doctors
                    </Link>

                    <Link className="nav-link" to="/register">
                        Register
                    </Link>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;