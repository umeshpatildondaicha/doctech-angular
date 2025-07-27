export interface Doctor {
  doctorId: number; // PK
  firstName: string;
  lastName: string;
  registrationNumber: string; // UNIQUE
  hospitalId: number; // FK
  specialization: string;
  globalNumber: string; // UNIQUE
  persanalNumber: string; // UNIQUE (typo in original, kept as is)
  email: string; // UNIQUE
  qualifications: string;
  profileImageUrl: string;
  doctorStatus: string;
  createdAt: string;
  departmentId: number; // FK
  updatedAt: string;
  isDeleted: boolean;
} 