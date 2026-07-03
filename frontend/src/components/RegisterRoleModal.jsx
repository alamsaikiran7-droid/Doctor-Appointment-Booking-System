import { useNavigate } from "react-router-dom";

function RegisterRoleModal() {
  const navigate = useNavigate();

  const goToRegister = (role) => {
    navigate(`/register/${role}`);
  };

  return (
    <div
      className="modal fade"
      id="registerRoleModal"
      tabIndex="-1"
      aria-labelledby="registerRoleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header bg-success text-white">
            <h5
              className="modal-title"
              id="registerRoleModalLabel"
            >
              Register As
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
              onClick={() => goToRegister("patient")}
            >
              👤 Patient
            </button>

            <button
              className="btn btn-outline-success w-100 mb-3"
              data-bs-dismiss="modal"
              onClick={() => goToRegister("doctor")}
            >
              👨‍⚕️ Doctor
            </button>

            <button
              className="btn btn-outline-dark w-100"
              data-bs-dismiss="modal"
              onClick={() => goToRegister("admin")}
            >
              👨‍💼 Admin
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default RegisterRoleModal;