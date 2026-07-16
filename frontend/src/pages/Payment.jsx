import { useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCreditCard,
} from "react-icons/fi";

import MainLayout from "../layouts/MainLayout";

import {
  createPayment,
  processPayment,
} from "../services/paymentService";


function formatFullDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString([], {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}


function formatTime(timeValue) {
  if (!timeValue) {
    return "-";
  }

  const parts = String(timeValue).split(":");

  const hours = Number(parts[0]);
  const minutes = Number(parts[1] || 0);

  if (Number.isNaN(hours)) {
    return timeValue;
  }

  const date = new Date();

  date.setHours(
    hours,
    minutes,
    0,
    0
  );

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}


function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentId } = useParams();

  const bookingDetails =
    location.state || {};

  const patientId = useMemo(() => {
    if (bookingDetails.patientId) {
      return Number(bookingDetails.patientId);
    }

    const storedPatientId =
      localStorage.getItem("userId");

    return storedPatientId
      ? Number(storedPatientId)
      : 0;
  }, [bookingDetails.patientId]);

  const amount = useMemo(() => {
    const bookingAmount =
      Number(bookingDetails.amount);

    return bookingAmount > 0
      ? bookingAmount
      : 0;
  }, [bookingDetails.amount]);

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [completedPayment, setCompletedPayment] =
    useState(null);


  const handlePayment = async () => {
    setError("");

    if (!appointmentId) {
      setError("Appointment ID is missing.");
      return;
    }

    if (!patientId) {
      setError(
        "Patient information is missing. Please log in again."
      );
      return;
    }

    if (!amount || amount <= 0) {
      setError(
        "Consultation fee is missing. Please return to the booking page."
      );
      return;
    }

    try {
      setLoading(true);

      const payment = await createPayment({
        appointment_id: Number(appointmentId),
        patient_id: patientId,
        amount,
        payment_method: paymentMethod,
      });

      const processedPayment =
        await processPayment(
          payment.id,
          {
            payment_successful: true,
            failure_reason: null,
          }
        );

      setCompletedPayment(processedPayment);
    } catch (err) {
      console.error(
        "Payment error:",
        err
      );

      const detail =
        err?.response?.data?.detail;

      if (
        detail ===
        "A payment already exists for this appointment"
      ) {
        setError(
          "A payment already exists for this appointment."
        );
      } else {
        setError(
          detail ||
            err.message ||
            "Payment failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  if (completedPayment) {
    return (
      <MainLayout>
        <section className="bg-gray-50 min-h-screen py-16">
          <div className="container-nc max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg border p-8 md:p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 grid place-items-center mx-auto">
                <FiCheckCircle size={42} />
              </div>

              <h1 className="text-3xl font-bold mt-6">
                Payment Successful
              </h1>

              <p className="text-gray-500 mt-3">
                Your appointment has been confirmed
                successfully.
              </p>

              <div className="border rounded-2xl bg-slate-50 p-6 mt-8 text-left">
                <div className="space-y-4">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      Appointment ID
                    </span>

                    <span className="font-semibold">
                      {appointmentId}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      Doctor
                    </span>

                    <span className="font-semibold text-right">
                      {bookingDetails.doctorName ||
                        "-"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      Date
                    </span>

                    <span className="font-semibold text-right">
                      {formatFullDate(
                        bookingDetails.appointmentDate
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      Time
                    </span>

                    <span className="font-semibold">
                      {formatTime(
                        bookingDetails.appointmentTime
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      Payment Method
                    </span>

                    <span className="font-semibold">
                      {completedPayment.payment_method}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      Amount Paid
                    </span>

                    <span className="font-bold text-primary">
                      ₹{completedPayment.amount}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      Transaction ID
                    </span>

                    <span className="font-mono text-sm text-right break-all">
                      {completedPayment.transaction_id}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      Status
                    </span>

                    <span className="font-semibold text-green-600">
                      {completedPayment.payment_status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/my-appointments")
                  }
                  className="btn-primary w-full"
                >
                  View My Appointments
                </button>

                <Link
                  to="/doctors"
                  className="btn-outline w-full text-center"
                >
                  Book Another Appointment
                </Link>
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }


  return (
    <MainLayout>
      <section className="bg-gray-50 min-h-screen py-12">
        <div className="container-nc max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-primary font-medium mb-8 hover:underline"
          >
            <FiArrowLeft />
            Back to Booking
          </button>

          <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8">
            <div className="bg-white rounded-3xl shadow-lg border p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary grid place-items-center">
                <FiCreditCard size={28} />
              </div>

              <h1 className="text-3xl font-bold mt-5">
                Complete Payment
              </h1>

              <p className="text-gray-500 mt-2">
                Select a demo payment method to
                confirm your appointment.
              </p>

              {error && (
                <div className="text-sm text-red-700 bg-red-100 rounded-xl px-4 py-3 mt-6">
                  {error}
                </div>
              )}

              <div className="mt-8">
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium mb-3"
                >
                  Payment Method
                </label>

                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  disabled={loading}
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                  className="input"
                >
                  <option value="UPI">
                    UPI
                  </option>

                  <option value="CARD">
                    Debit / Credit Card
                  </option>

                  <option value="NET_BANKING">
                    Net Banking
                  </option>

                  <option value="CASH">
                    Cash
                  </option>
                </select>
              </div>

              <button
                type="button"
                disabled={
                  loading ||
                  !amount ||
                  amount <= 0
                }
                onClick={handlePayment}
                className="btn-primary w-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing Payment..."
                  : `Pay ₹${amount}`}
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                This is a demo payment. No real money
                will be charged.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border p-8 h-fit">
              <h2 className="text-2xl font-bold">
                Appointment Summary
              </h2>

              <div className="space-y-4 mt-7">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Appointment ID
                  </span>

                  <span className="font-semibold">
                    {appointmentId}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Doctor
                  </span>

                  <span className="font-semibold text-right">
                    {bookingDetails.doctorName ||
                      "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Specialization
                  </span>

                  <span className="font-semibold text-right">
                    {bookingDetails.specialization ||
                      "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Date
                  </span>

                  <span className="font-semibold text-right">
                    {formatFullDate(
                      bookingDetails.appointmentDate
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Time
                  </span>

                  <span className="font-semibold">
                    {formatTime(
                      bookingDetails.appointmentTime
                    )}
                  </span>
                </div>

                <div className="border-t pt-4 flex justify-between gap-4">
                  <span className="text-lg font-semibold">
                    Consultation Fee
                  </span>

                  <span className="text-2xl font-bold text-primary">
                    ₹{amount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}


export default Payment;