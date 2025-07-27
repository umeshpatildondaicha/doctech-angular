export interface ExerciseSet {
  setId: string; // PK
  exerciseId: string; // FK
  setNumber: number;
  reps: number;
  holdTime: number; // in seconds
  restTime: number; // in seconds
}

export interface Exercise {
  exerciseId: string; // PK
  name: string;
  description: string;
  createdByDoctorId: string; // FK
  exerciseType: string;
} 