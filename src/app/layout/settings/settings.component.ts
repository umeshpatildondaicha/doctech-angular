import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { AppSelectboxComponent } from '../../tools/app-selectbox/app-selectbox.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppButtonComponent,
    AppInputComponent,
    AppSelectboxComponent,
    IconComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  settingsForm: FormGroup;
  notificationForm: FormGroup;
  activeTab = 'general';

  themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'auto', label: 'Auto (System)' }
  ];

  languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      theme: ['light', Validators.required],
      language: ['en', Validators.required],
      timezone: ['UTC-5', Validators.required],
      dateFormat: ['MM/DD/YYYY', Validators.required],
      timeFormat: ['12h', Validators.required]
    });

    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      smsNotifications: [false],
      appointmentReminders: [true],
      newPatientAlerts: [true],
      systemUpdates: [false],
      marketingEmails: [false]
    });
  }

  onTabChange(tab: string) {
    this.activeTab = tab;
  }

  onSaveSettings() {
    if (this.settingsForm.valid) {
      console.log('Settings saved:', this.settingsForm.value);
      // TODO: Send to backend API
    } else {
      this.markFormGroupTouched(this.settingsForm);
    }
  }

  onSaveNotifications() {
    if (this.notificationForm.valid) {
      console.log('Notification settings saved:', this.notificationForm.value);
      // TODO: Send to backend API
    } else {
      this.markFormGroupTouched(this.notificationForm);
    }
  }

  onResetSettings() {
    this.settingsForm.patchValue({
      theme: 'light',
      language: 'en',
      timezone: 'UTC-5',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h'
    });
  }

  onResetNotifications() {
    this.notificationForm.patchValue({
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      newPatientAlerts: true,
      systemUpdates: false,
      marketingEmails: false
    });
  }

  private markFormGroupTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(form: FormGroup, fieldName: string): string {
    const control = form.get(fieldName);
    if (control?.invalid && control?.touched) {
      return 'This field is required';
    }
    return '';
  }
}
