import { useNavigate } from "react-router-dom";

function LoginRoleModal() {
  const navigate = useNavigate();

  const goToLogin = (role) => {
    navigate(`/login/${role}`);
  };

  return (
    <div
      className="modal fade"
      id="loginRoleModal"
      tabIndex="-1"
      aria-labelledby="loginRoleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5
              className="modal-title"
              id="loginRoleModalLabel"
            >
              Login As
            </h5>

            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">

            <button
              className="btn btn-outline-primary w-100 mb-3"
              data-bs-dismiss="modal"
              onClick={() => goToLogin("patient")}
            >
              👤 Patient
            </button>

            <button
              className="btn btn-outline-success w-100 mb-3"
              data-bs-dismiss="modal"
              onClick={() => goToLogin("doctor")}
            >
              👨‍⚕️ Doctor
            </button>

            <button
              className="btn btn-outline-dark w-100"
              data-bs-dismiss="modal"
              onClick={() => goToLogin("admin")}
            >
              👨‍💼 Admin
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginRoleModal;