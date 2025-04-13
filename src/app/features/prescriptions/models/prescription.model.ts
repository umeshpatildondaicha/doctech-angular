export interface Doctor {
  name: string;
  specialization: string;
  registrationNumber: string;
  clinicName: string;
  address: string;
  phone: string;
  email?: string;
}

export interface Patient {
  name: string;
  age: number;
  gender: string;
  address: string;
  phone: string;
  email?: string;
  bloodGroup?: string;
  height?: string;
  weight?: string;
  allergies?: string[];
  medicalHistory?: string[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  route?: string;
  timing?: string;
  withFood?: boolean;
}

export interface Investigation {
  name: string;
  date: string;
  reason?: string;
  instructions?: string;
  results?: string;
  status?: 'Ordered' | 'Completed' | 'Pending';
}

export interface VitalSigns {
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  oxygenSaturation?: string;
  respiratoryRate?: string;
}

export interface Attachment {
  name: string;
  type: string;
  url: string;
}

export interface Prescription {
  prescriptionId: string;
  date: string;
  doctor: Doctor;
  patient: Patient;
  diagnosis: string;
  symptoms: string[];
  vitals?: VitalSigns;
  medications: Medication[];
  investigations?: Investigation[];
  notes?: string;
  nextVisitDate?: string;
  followUpInstructions?: string[];
  signature: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  priority: 'Normal' | 'Urgent' | 'Emergency';
  attachments?: Attachment[];
}

export interface PrescriptionTemplate {
  id: string;
  name: string;
  description: string;
  medications: Medication[];
  notes?: string;
}

export interface ClinicSettings {
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  defaultDoctor: {
    name: string;
    specialization: string;
    registrationNumber: string;
    signature: string;
    email: string;
  };
}
