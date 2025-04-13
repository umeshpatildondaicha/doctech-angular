import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Prescription, PrescriptionTemplate } from '../models/prescription.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private prescriptions = new BehaviorSubject<Prescription[]>([]);
  private templates = new BehaviorSubject<PrescriptionTemplate[]>([]);
  private currentPrescription = new BehaviorSubject<Prescription | null>(null);
  private isBrowser: boolean;
  private lastSavedPrescriptionId: string | null = null;
  private saveTimeout: any;

  prescriptions$ = this.prescriptions.asObservable();
  templates$ = this.templates.asObservable();
  currentPrescription$ = this.currentPrescription.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadInitialData();
  }

  private loadInitialData() {
    if (this.isBrowser) {
      // Load prescriptions from local storage
      const savedPrescriptions = localStorage.getItem('prescriptions');
      if (savedPrescriptions) {
        try {
          const parsedPrescriptions = JSON.parse(savedPrescriptions);
          this.prescriptions.next(parsedPrescriptions);
          console.log('Loaded prescriptions from localStorage:', parsedPrescriptions);
        } catch (error) {
          console.error('Error parsing stored prescriptions:', error);
          this.loadFromJsonFile();
        }
      } else {
        // Load from JSON file if no data in localStorage
        this.loadFromJsonFile();
      }

      // Load templates from local storage
      const savedTemplates = localStorage.getItem('templates');
      if (savedTemplates) {
        try {
          const parsedTemplates = JSON.parse(savedTemplates);
          this.templates.next(parsedTemplates);
          console.log('Loaded templates from localStorage:', parsedTemplates);
        } catch (error) {
          console.error('Error parsing stored templates:', error);
          this.loadTemplatesFromJsonFile();
        }
      } else {
        this.loadTemplatesFromJsonFile();
      }
    }
  }

  private loadFromJsonFile() {
    console.log('Loading prescriptions from JSON file');
    fetch('assets/data/prescriptions.json')
      .then(response => {
        console.log('JSON file response:', response);
        if (!response.ok) {
          throw new Error(`Failed to load prescriptions.json: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Loaded JSON data:', data);
        if (data && data.prescriptions && Array.isArray(data.prescriptions)) {
          this.prescriptions.next(data.prescriptions);
          console.log('Loaded prescriptions from JSON:', data.prescriptions);
          this.savePrescriptionsToStorage();
        } else {
          console.error('Invalid prescriptions data format in JSON file');
          this.prescriptions.next([]);
        }
      })
      .catch(error => {
        console.error('Error loading prescriptions from JSON:', error);
        // Initialize with an empty array if file can't be loaded
        this.prescriptions.next([]);
      });
  }

  private loadTemplatesFromJsonFile() {
    console.log('Loading templates from JSON file');
    fetch('assets/data/prescriptions.json')
      .then(response => {
        console.log('JSON file response for templates:', response);
        if (!response.ok) {
          throw new Error(`Failed to load prescriptions.json: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Loaded JSON data for templates:', data);
        if (data && data.templates && Array.isArray(data.templates)) {
          this.templates.next(data.templates);
          console.log('Loaded templates from JSON:', data.templates);
          this.saveTemplatesToStorage();
        } else {
          console.error('Invalid templates data format in JSON file');
          this.templates.next([]);
        }
      })
      .catch(error => {
        console.error('Error loading templates from JSON:', error);
        // Initialize with an empty array if file can't be loaded
        this.templates.next([]);
      });
  }

  private savePrescriptionsToStorage() {
    if (this.isBrowser) {
      try {
        localStorage.setItem('prescriptions', JSON.stringify(this.prescriptions.getValue()));
      } catch (error) {
        console.error('Error saving prescriptions to localStorage:', error);
      }
    }
  }

  private saveTemplatesToStorage() {
    if (this.isBrowser) {
      try {
        localStorage.setItem('templates', JSON.stringify(this.templates.getValue()));
      } catch (error) {
        console.error('Error saving templates to localStorage:', error);
      }
    }
  }

  getPrescriptions(): Observable<Prescription[]> {
    return this.prescriptions$;
  }

  getTemplates(): Observable<PrescriptionTemplate[]> {
    return this.templates$;
  }

  getCurrentPrescription(): Observable<Prescription | null> {
    return this.currentPrescription$;
  }

  savePrescription(prescription: Prescription): Observable<void> {
    console.log('savePrescription called with:', prescription);

    // Validate prescription object
    if (!prescription || !prescription.prescriptionId) {
      console.error('Invalid prescription object:', prescription);
      return of(void 0);
    }

    // Prevent duplicate saves within 1 second
    if (prescription.prescriptionId === this.lastSavedPrescriptionId) {
      console.log('Preventing duplicate save for prescription:', prescription.prescriptionId);
      return of(void 0);
    }

    // Clear any existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.lastSavedPrescriptionId = prescription.prescriptionId;
    const prescriptions = this.prescriptions.getValue();
    console.log('Current prescriptions before save:', prescriptions);

    const index = prescriptions.findIndex(p => p.prescriptionId === prescription.prescriptionId);
    let updatedPrescriptions = [...prescriptions]; // Create a new array to ensure change detection

    console.log('Found prescription at index:', index);

    if (index !== -1) {
      // Update existing prescription
      updatedPrescriptions[index] = { ...prescription }; // Create a new object to ensure change detection
      console.log('Updated existing prescription at index:', index);
    } else {
      // Add new prescription at the beginning
      updatedPrescriptions = [prescription, ...prescriptions];
      console.log('Added new prescription at beginning of array');
    }

    console.log('Updated prescriptions array:', updatedPrescriptions);

    // Update BehaviorSubjects
    this.prescriptions.next(updatedPrescriptions);
    this.currentPrescription.next(prescription);

    // Save to localStorage
    try {
      this.savePrescriptionsToStorage();
      console.log('Saved prescriptions to localStorage successfully');
    } catch (error) {
      console.error('Error saving prescriptions to localStorage:', error);
    }

    // Reset the last saved prescription ID after 1 second
    this.saveTimeout = setTimeout(() => {
      this.lastSavedPrescriptionId = null;
    }, 1000);

    return of(void 0);
  }

  createPrescription(prescription: Prescription): Observable<void> {
    const newPrescription = {
      ...prescription,
      prescriptionId: prescription.prescriptionId || `PRES-${Date.now()}`,
      date: prescription.date || new Date().toISOString()
    };
    this.currentPrescription.next(newPrescription);
    return this.savePrescription(newPrescription);
  }

  updatePrescription(prescription: Prescription): Observable<void> {
    return this.savePrescription(prescription);
  }

  deletePrescription(prescriptionId: string): Observable<void> {
    const prescriptions = this.prescriptions.getValue();
    const filteredPrescriptions = prescriptions.filter(p => p.prescriptionId !== prescriptionId);

    this.prescriptions.next(filteredPrescriptions);

    // Clear current prescription if it's the one being deleted
    const current = this.currentPrescription.getValue();
    if (current && current.prescriptionId === prescriptionId) {
      this.currentPrescription.next(null);
    }

    this.savePrescriptionsToStorage();
    return of(void 0);
  }

  saveTemplate(template: PrescriptionTemplate): Observable<void> {
    const templates = this.templates.getValue();
    templates.push(template);
    this.templates.next(templates);
    this.saveTemplatesToStorage();
    return of(void 0);
  }

  clearForm() {
    this.currentPrescription.next(null);
  }

  printPrescription(prescription: Prescription): void {
    if (this.isBrowser) {
      window.print();
    }
  }

  getDemoPrescription(): Prescription {
    return {
      prescriptionId: `PRES-${Date.now()}`,
      date: new Date().toISOString(),
      doctor: {
        name: "Dr. John Smith",
        specialization: "Cardiologist",
        registrationNumber: "MD12345",
        clinicName: "Heart Care Clinic",
        address: "123 Healthcare Street",
        phone: "555-0123"
      },
      patient: {
        name: "Jane Doe",
        age: 45,
        gender: "Female",
        address: "456 Patient Ave",
        phone: "555-4567"
      },
      diagnosis: "Hypertension",
      symptoms: ["High blood pressure", "Headache"],
      medications: [
        {
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Take in the morning",
          route: "Oral",
          timing: "Morning",
          withFood: true
        }
      ],
      signature: "Dr. J. Smith",
      status: "Active",
      priority: "Normal"
    };
  }
}
