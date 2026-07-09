# =====================================
# Appointment Booking Notification
# =====================================
def appointment_booked_message(
    patient_name: str,
    doctor_name: str,
    slot_date: str,
    slot_time: str
):
    return (
        f"Hello {patient_name}, your appointment with "
        f"Dr. {doctor_name} has been booked successfully.\n"
        f"Date: {slot_date}\n"
        f"Time: {slot_time}\n"
        f"Thank you for choosing our hospital."
    )


# =====================================
# Appointment Cancellation Notification
# =====================================
def appointment_cancelled_message(
    patient_name: str,
    doctor_name: str
):
    return (
        f"Hello {patient_name}, your appointment with "
        f"Dr. {doctor_name} has been cancelled."
    )


# =====================================
# Appointment Reminder Notification
# =====================================
def appointment_reminder_message(
    patient_name: str,
    doctor_name: str,
    slot_date: str,
    slot_time: str
):
    return (
        f"Reminder: Dear {patient_name}, you have an appointment "
        f"with Dr. {doctor_name} on {slot_date} at {slot_time}."
    )


# =====================================
# Send SMS (Dummy Function)
# =====================================
def send_sms(phone_number: str, message: str):
    """
    Dummy SMS sender.
    Replace this function with an SMS API
    like Twilio, MSG91, or Fast2SMS.
    """

    print("=" * 50)
    print("SMS Notification")
    print(f"To      : {phone_number}")
    print(f"Message : {message}")
    print("=" * 50)

    return True