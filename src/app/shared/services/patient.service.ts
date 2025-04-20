import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Patient } from '../models/patient.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private mockPatients: Patient[] = [
    {
      id: 'P001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      condition: 'Diabetes',
      status: 'Stable',
      admissionDate: '2024-02-15',
      doctor: 'Dr. Smith',
      ward: 'General',
      roomNumber: '101'
    },
    {
      id: 'P002',
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      condition: 'Hypertension',
      status: 'Under Observation',
      admissionDate: '2024-02-14',
      doctor: 'Dr. Johnson',
      ward: 'Cardiology',
      roomNumber: '205'
    },
    // Add more mock patients as needed
  ];

  constructor() { }

  getPatients(): Observable<Patient[]> {
    return of(this.mockPatients);
  }

  getConditions(): string[] {
    return [...new Set(this.mockPatients.map(p => p.condition))];
  }

  getWards(): string[] {
    return [...new Set(this.mockPatients.map(p => p.ward))];
  }

  getDoctors(): string[] {
    return [...new Set(this.mockPatients.map(p => p.doctor))];
  }

  getPatientById(id: string): Observable<Patient | undefined> {
    return of(this.mockPatients.find(p => p.id === id));
  }
} 