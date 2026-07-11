// Adapter utilities to normalize backend models to frontend shape
export function adaptDoctor(backend) {
  if (!backend) return null;

  return {
    id: backend.id,
    name: backend.name,
    specialization: backend.speciality || backend.specialization || "General",
    city: backend.city || "",
    clinic: backend.clinic || backend.city || "",
    fee: backend.consultation_fee ?? backend.fee ?? 0,
    experience: backend.experience_years ?? backend.experience ?? 0,
    rating: backend.rating ?? 4.5,
    reviews: backend.reviews ?? 0,
    gender: backend.gender ?? null,
    about: backend.bio ?? backend.about ?? "",
    education: backend.education ?? [],
    languages: backend.languages ?? ["English"],
  };
}

export function adaptDoctorsList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(adaptDoctor);
}

export function adaptUser(backend) {
  if (!backend) return null;
  return {
    id: backend.id ?? backend.user_id ?? backend.uid,
    name: backend.full_name || backend.name || backend.username || "User",
    username: backend.username || backend.email || (backend.name && backend.name.split(" ")[0].toLowerCase()),
    email: backend.email || null,
    phone: backend.phone || backend.mobile || null,
    role: backend.role || backend.user_type || "patient",
  };
}

export function adaptAppointment(backend) {
  if (!backend) return null;
  // backend may include nested doctor/patient objects or flattened fields
  const doctor = backend.doctor || backend.doctor_info || {};
  return {
    id: backend.id ?? backend.appointment_id ?? Date.now(),
    patientId: backend.patient_id ?? backend.patientId ?? backend.patient?.id,
    patientName: backend.patient_name ?? backend.patient?.name ?? backend.patient?.full_name,
    doctorId: backend.doctor_id ?? backend.doctorId ?? doctor.id,
    doctorName: doctor.name || doctor.full_name || backend.doctor_name || "Doctor",
    specialization: doctor.speciality || doctor.specialization || backend.specialization || "General",
    date: backend.date || backend.appointment_date || backend.slot_date || "",
    time: backend.time || backend.appointment_time || backend.slot_time || "",
    status: (backend.status || backend.state || "BOOKED").toString().toUpperCase(),
    notes: backend.notes || backend.reason || "",
  };
}

export function adaptAppointmentsList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(adaptAppointment);
}

// --- Outbound adapters (frontend -> backend) ---
export function adaptDoctorForBackend(frontend) {
  if (!frontend) return null;
  return {
    id: frontend.id,
    name: frontend.name,
    email: frontend.email,
    phone: frontend.phone,
    speciality: frontend.specialization || frontend.speciality,
    city: frontend.city,
    experience_years: frontend.experience ?? frontend.experience_years,
    consultation_fee: frontend.fee ?? frontend.consultation_fee,
    bio: frontend.about ?? frontend.bio,
  };
}

export function adaptUserForBackend(frontend) {
  if (!frontend) return null;
  return {
    id: frontend.id,
    full_name: frontend.name,
    username: frontend.username,
    email: frontend.email,
    phone: frontend.phone,
    role: frontend.role,
  };
}

export function adaptAppointmentForBackend(frontend) {
  if (!frontend) return null;
  return {
    appointment_id: frontend.id,
    patient_id: frontend.patientId || frontend.patient_id,
    patient_name: frontend.patientName || frontend.patient_name,
    doctor_id: frontend.doctorId || frontend.doctor_id,
    doctor_name: frontend.doctorName || frontend.doctor_name,
    specialization: frontend.specialization || frontend.speciality,
    appointment_date: frontend.date,
    appointment_time: frontend.time,
    status: frontend.status || "BOOKED",
    notes: frontend.notes || frontend.reason || "",
  };
}
