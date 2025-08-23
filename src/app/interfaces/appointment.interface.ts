export interface Appointment {
  appointment_id: number;
  patient_id: number;
  appointment_date_time: string;
  notes: string;
  created_at: string;
  updated_at: string;
  doctor_id: number;
  slot_id: number;
  status: 'SCHEDULED' | 'CANCELED' | 'COMPLETED' | 'PENDING';
  
  // Additional display fields for UI
  patientName?: string;
  doctorName?: string;
  slotTime?: string;
} 