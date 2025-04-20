export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  status: string;
  admissionDate: string;
  doctor: string;
  ward: string;
  roomNumber: string;
  [key: string]: string | number;  // For dynamic column access
} 