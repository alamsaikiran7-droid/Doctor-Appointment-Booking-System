import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { FiArrowLeft, FiLock, FiSave } from "react-icons/fi";
import { changeDoctorPassword } from "../services/authService";

function ChangeDoctorPassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      await changeDoctorPassword(currentPassword, newPassword);

      setSuccess("Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/doctor/profile");
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <DashboardLayout role="doctor">
      <div className="max-w-lg mx-auto">

        <button
          onClick={() => navigate("/doctor/profile")}
          className="flex items-center gap-2 text-primary mb-6"
        >
          <FiArrowLeft />
          Back to Profile
        </button>

        <div className="card p-8">

          <h1 className="text-3xl font-bold mb-2">
            Change Password
          </h1>

          <p className="text-muted mb-8">
            Update your account password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Current Password */}
            <div>
              <label className="label">
                Current Password
              </label>

              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-muted" />

                <input
                  type="password"
                  className="input pl-10"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="label">
                New Password
              </label>

              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-muted" />

                <input
                  type="password"
                  className="input pl-10"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">
                Confirm Password
              </label>

              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-muted" />

                <input
                  type="password"
                  className="input pl-10"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-100 text-red-700 px-4 py-3">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-100 text-green-700 px-4 py-3">
                {success}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">

              <button
                type="button"
                className="btn-outline"
                onClick={() =>
                  navigate("/doctor/profile")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary"
              >
                <FiSave size={18} />
                Change Password
              </button>

            </div>

          </form>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default ChangeDoctorPassword;