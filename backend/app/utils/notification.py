from datetime import date, time
from typing import Union


DateValue = Union[date, str]
TimeValue = Union[time, str]


# =====================================
# Format Appointment Date
# =====================================
def format_slot_date(slot_date: DateValue) -> str:
    if isinstance(slot_date, date):
        return slot_date.strftime("%d-%m-%Y")

    return str(slot_date)


# =====================================
# Format Appointment Time
# =====================================
def format_slot_time(slot_time: TimeValue) -> str:
    if isinstance(slot_time, time):
        return slot_time.strftime("%I:%M %p")

    return str(slot_time)


# =====================================
# Appointment Booking Notification
# =====================================
def appointment_booked_message(
    patient_name: str,
    doctor_name: str,
    slot_date: DateValue,
    slot_time: TimeValue,
) -> str:
    formatted_date = format_slot_date(slot_date)
    formatted_time = format_slot_time(slot_time)

    return (
        f"Hello {patient_name}, your appointment with "
        f"Dr. {doctor_name} has been booked successfully.\n"
        f"Date: {formatted_date}\n"
        f"Time: {formatted_time}\n"
        f"Status: Pending confirmation\n"
        f"Thank you for choosing our hospital."
    )


# =====================================
# Appointment Accepted Notification
# =====================================
def appointment_accepted_message(
    patient_name: str,
    doctor_name: str,
    slot_date: DateValue,
    slot_time: TimeValue,
) -> str:
    formatted_date = format_slot_date(slot_date)
    formatted_time = format_slot_time(slot_time)

    return (
        f"Hello {patient_name}, your appointment with "
        f"Dr. {doctor_name} has been confirmed.\n"
        f"Date: {formatted_date}\n"
        f"Time: {formatted_time}\n"
        f"Please arrive a few minutes early."
    )


# =====================================
# Appointment Declined Notification
# =====================================
def appointment_declined_message(
    patient_name: str,
    doctor_name: str,
    reason: str = "",
) -> str:
    message = (
        f"Hello {patient_name}, your appointment with "
        f"Dr. {doctor_name} has been declined."
    )

    if reason.strip():
        message += f"\nReason: {reason.strip()}"

    return message


# =====================================
# Appointment Cancellation Notification
# =====================================
def appointment_cancelled_message(
    patient_name: str,
    doctor_name: str,
) -> str:
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
    slot_date: DateValue,
    slot_time: TimeValue,
) -> str:
    formatted_date = format_slot_date(slot_date)
    formatted_time = format_slot_time(slot_time)

    return (
        f"Reminder: Hello {patient_name}, you have an appointment "
        f"with Dr. {doctor_name} on {formatted_date} "
        f"at {formatted_time}.\n"
        f"Please arrive a few minutes early."
    )


# =====================================
# Send SMS — Development Version
# =====================================
def send_sms(
    phone_number: str,
    message: str,
) -> bool:
    """
    Development-only SMS sender.

    This function prints the SMS in the backend terminal.
    Replace it later with Twilio, MSG91, Fast2SMS, or another
    real SMS provider.
    """

    if not phone_number or not phone_number.strip():
        print("SMS not sent: phone number is missing.")
        return False

    if not message or not message.strip():
        print("SMS not sent: message is empty.")
        return False

    try:
        print("\n" + "=" * 60)
        print("SMS NOTIFICATION — DEVELOPMENT MODE")
        print(f"To      : {phone_number}")
        print(f"Message :\n{message}")
        print("=" * 60 + "\n")

        return True

    except Exception as error:
        print(f"SMS notification failed: {error}")
        return False