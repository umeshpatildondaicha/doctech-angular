import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

import { DashboardDetailsComponent } from '../dashboard-details/dashboard-details.component';
import { ChatService } from '../../services/chat.service';
import { RoomsService } from '../../services/rooms.service';
import { PatientQueueService } from '../../services/patient-queue.service';

interface DashboardStats {
  roomAvailability: number;
  totalRooms: number;
  bookAppointment: number;
  totalPatients: number;
  overallVisitors: number;
}

interface TodayAppointment {
  id: number;
  patientName: string;
  patientAvatar?: string;
  time: string;
  symptoms: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

interface NextPatient {
  id: number;
  name: string;
  avatar?: string;
  appointmentTime: string;
  reason: string;
  age: number;
  gender: string;
  height?: string;
  weight?: string;
  dateOfBirth: string;
  registrationDate: string;
  lastAppointment?: string;
  lastDiseases?: string[];
  contactNumber?: string;
}

interface AppointmentRequest {
  id: number;
  patientName: string;
  patientAvatar?: string;
  requestedDate: string;
  requestedTime: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  paymentStatus: 'PAID' | 'PENDING' | 'UNPAID';
}

interface MessagePreview {
  id: string;
  patientName: string;
  patientAvatar?: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardDetailsComponent,
    HighchartsChartModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  Highcharts: typeof Highcharts = Highcharts;
  isBrowser = false;

  // Stats
  stats: DashboardStats = {
    roomAvailability: 50,
    totalRooms: 100,
    bookAppointment: 291,
    totalPatients: 871,
    overallVisitors: 1210
  };

  // Today's Appointments
  todayAppointments: TodayAppointment[] = [];

  // Next Patient
  nextPatient: NextPatient | null = null;

  // Appointment Requests
  appointmentRequests: AppointmentRequest[] = [];

  // Messages
  unreadMessagesCount = 5;
  recentMessages: MessagePreview[] = [];

  // Chart Options
  patientVisitChartOptions: Highcharts.Options = {};
  revenueChartOptions: Highcharts.Options = {};
  patientDemographicsChartOptions: Highcharts.Options = {};
  appointmentStatusChartOptions: Highcharts.Options = {};

  constructor(
    private dialog: MatDialog,
    private readonly router: Router,
    private readonly chatService: ChatService,
    private readonly roomsService: RoomsService,
    private readonly patientQueueService: PatientQueueService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadDashboardData();
    if (this.isBrowser) {
      this.initializeCharts();
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser && !this.patientVisitChartOptions.chart) {
      setTimeout(() => {
        this.initializeCharts();
      }, 0);
    }
  }

  loadDashboardData() {
    // Load room availability
    const rooms = this.roomsService.getRooms();
    const availableRooms = rooms.filter(r => r.status === 'Available').length;
    this.stats.roomAvailability = availableRooms;
    this.stats.totalRooms = rooms.length;

    // Mock data for today's appointments
    this.todayAppointments = [
      {
        id: 1,
        patientName: 'Jenny Wilson',
        patientAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        time: '09:00 AM',
        symptoms: 'Fever & Headache',
        status: 'CONFIRMED'
      },
      {
        id: 2,
        patientName: 'Albert Flores',
        patientAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        time: '10:30 AM',
        symptoms: 'Chest Pain',
        status: 'PENDING'
      },
      {
        id: 3,
        patientName: 'Floyd Miles',
        patientAvatar: 'https://randomuser.me/api/portraits/men/46.jpg',
        time: '11:00 AM',
        symptoms: 'Back Pain',
        status: 'CONFIRMED'
      },
      {
        id: 4,
        patientName: 'Marvin McKinney',
        patientAvatar: 'https://randomuser.me/api/portraits/men/47.jpg',
        time: '02:00 PM',
        symptoms: 'Dizziness',
        status: 'PENDING'
      },
      {
        id: 5,
        patientName: 'Sarah Johnson',
        patientAvatar: 'https://randomuser.me/api/portraits/women/48.jpg',
        time: '03:30 PM',
        symptoms: 'Cough & Cold',
        status: 'CONFIRMED'
      }
    ];

    // Next patient
    this.nextPatient = {
      id: 1,
      name: 'Jenny Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      appointmentTime: '09:00 AM',
      reason: 'Regular Checkup',
      age: 35,
      gender: 'Female',
      height: '5\'6"',
      weight: '65 kg',
      dateOfBirth: '1989-05-15',
      registrationDate: '2020-03-10',
      lastAppointment: '2024-11-15',
      lastDiseases: ['Hypertension', 'Diabetes Type 2'],
      contactNumber: '+1 555 0123'
    };

    // Appointment requests
    this.appointmentRequests = [
      {
        id: 1,
        patientName: 'Robert Chen',
        patientAvatar: 'https://randomuser.me/api/portraits/men/51.jpg',
        requestedDate: 'Today',
        requestedTime: '04:00 PM',
        reason: 'Emergency Consultation',
        priority: 'HIGH',
        paymentStatus: 'PAID'
      },
      {
        id: 2,
        patientName: 'Emily Davis',
        patientAvatar: 'https://randomuser.me/api/portraits/women/52.jpg',
        requestedDate: 'Tomorrow',
        requestedTime: '10:00 AM',
        reason: 'Follow-up Visit',
        priority: 'MEDIUM',
        paymentStatus: 'PENDING'
      },
      {
        id: 3,
        patientName: 'Michael Brown',
        patientAvatar: 'https://randomuser.me/api/portraits/men/53.jpg',
        requestedDate: 'Tomorrow',
        requestedTime: '02:00 PM',
        reason: 'General Consultation',
        priority: 'LOW',
        paymentStatus: 'UNPAID'
      },
      {
        id: 4,
        patientName: 'Sarah Johnson',
        patientAvatar: 'https://randomuser.me/api/portraits/women/54.jpg',
        requestedDate: 'Tomorrow',
        requestedTime: '03:00 PM',
        reason: 'Annual Checkup',
        priority: 'MEDIUM',
        paymentStatus: 'PAID'
      }
    ];

    // Get unread messages count and recent messages from chat service
    this.chatService.getUnreadMessageCount().subscribe((count: number) => {
      this.unreadMessagesCount = count;
    });

    // Get top 5 recent messages
    this.chatService.getChatSessions({
      appointmentStatus: 'ALL',
      searchTerm: '',
      sortBy: 'LAST_ACTIVITY',
      sortOrder: 'DESC'
    }).subscribe(sessions => {
      this.recentMessages = sessions.slice(0, 5).map(session => ({
        id: session.id,
        patientName: session.patientName,
        patientAvatar: session.patientAvatar,
        lastMessage: session.lastMessage?.content || 'No messages',
        timestamp: session.lastActivity,
        unreadCount: session.unreadCount
      }));
    });
  }

  initializeCharts() {
    // Patient Visit Chart
    this.patientVisitChartOptions = {
      chart: {
        type: 'spline',
        backgroundColor: 'transparent',
        height: 300,
        spacing: [10, 10, 10, 10]
      },
      title: {
        text: 'Patient Visits',
        style: { fontSize: '16px', fontWeight: '600', color: '#1e293b' }
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: { style: { fontSize: '11px', color: '#64748b' } },
        lineColor: '#e2e8f0',
        tickColor: '#e2e8f0'
      },
      yAxis: {
        title: { text: 'Visits' },
        labels: { style: { fontSize: '11px', color: '#64748b' } },
        gridLineColor: '#f1f5f9',
        gridLineWidth: 1
      },
      legend: { enabled: true },
      credits: { enabled: false },
      plotOptions: {
        spline: {
          lineWidth: 3,
          marker: { enabled: false },
          states: { hover: { lineWidth: 4 } }
        }
      },
      series: [
        {
          name: 'This Year',
          type: 'spline',
          data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
          color: '#10b3b3'
        },
        {
          name: 'Last Year',
          type: 'spline',
          data: [80, 100, 90, 110, 70, 150, 140, 130, 140, 160, 180, 200],
          color: '#94a3b8'
        }
      ],
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderRadius: 8,
        borderWidth: 1,
        shadow: true,
        style: { fontSize: '12px' }
      }
    };

    // Revenue Chart
    this.revenueChartOptions = {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        height: 280
      },
      title: {
        text: 'Monthly Revenue',
        style: { fontSize: '16px', fontWeight: '600', color: '#1e293b' }
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        labels: { style: { fontSize: '11px', color: '#64748b' } },
        lineColor: '#e2e8f0',
        tickColor: '#e2e8f0'
      },
      yAxis: {
        title: { text: 'Revenue (₹)' },
        labels: { style: { fontSize: '11px', color: '#64748b' } },
        gridLineColor: '#f1f5f9',
        gridLineWidth: 1
      },
      legend: { enabled: false },
      credits: { enabled: false },
      plotOptions: {
        column: {
          borderRadius: 6,
          color: '#10b3b3',
          dataLabels: {
            enabled: true,
            style: { fontSize: '11px', fontWeight: '600', color: '#64748b' }
          }
        }
      },
      series: [{
        name: 'Revenue',
        type: 'column',
        data: [45000, 52000, 48000, 61000, 55000, 67000]
      }],
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderRadius: 8,
        borderWidth: 1,
        shadow: true,
        formatter: function() {
          return `<b>${this.x}</b><br/>Revenue: <b>₹${this.y?.toLocaleString()}</b>`;
        }
      }
    };

    // Patient Demographics Chart
    this.patientDemographicsChartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 280
      },
      title: {
        text: 'Patient Demographics',
        style: { fontSize: '16px', fontWeight: '600', color: '#1e293b' }
      },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: { fontSize: '11px', color: '#64748b' }
          },
          colors: ['#10b3b3', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']
        }
      },
      series: [{
        name: 'Patients',
        type: 'pie',
        data: [
          { name: 'Age 0-18', y: 15 },
          { name: 'Age 19-35', y: 35 },
          { name: 'Age 36-50', y: 28 },
          { name: 'Age 51-65', y: 15 },
          { name: 'Age 65+', y: 7 }
        ]
      }],
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderRadius: 8,
        borderWidth: 1,
        shadow: true,
        formatter: function() {
          const point = this as any;
          if (point?.point?.name) {
            return `<b>${point.point.name}</b><br/>Patients: <b>${this.y}%</b>`;
          }
          return '';
        }
      }
    };

    // Appointment Status Chart
    this.appointmentStatusChartOptions = {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        height: 250
      },
      title: {
        text: 'Appointment Status',
        style: { fontSize: '16px', fontWeight: '600', color: '#1e293b' }
      },
      xAxis: {
        categories: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
        labels: { style: { fontSize: '11px', color: '#64748b' } },
        lineColor: '#e2e8f0',
        tickColor: '#e2e8f0'
      },
      yAxis: {
        title: { text: 'Count' },
        labels: { style: { fontSize: '11px', color: '#64748b' } },
        gridLineColor: '#f1f5f9',
        gridLineWidth: 1
      },
      legend: { enabled: false },
      credits: { enabled: false },
      plotOptions: {
        bar: {
          borderRadius: 6,
          colorByPoint: true,
          colors: ['#10b3b3', '#f59e0b', '#ef4444', '#22c55e'],
          dataLabels: {
            enabled: true,
            style: { fontSize: '11px', fontWeight: '600', color: '#ffffff' }
          }
        }
      },
      series: [{
        name: 'Appointments',
        type: 'bar',
        data: [180, 65, 20, 145]
      }],
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderRadius: 8,
        borderWidth: 1,
        shadow: true,
        formatter: function() {
          return `<b>${this.x}</b><br/>Count: <b>${this.y}</b>`;
        }
      }
    };
  }

  openDetails(cardType: 'patients' | 'appointments' | 'billing', event?: Event) {
    if (event && event.target instanceof HTMLElement) {
      event.target.blur();
    }
    this.dialog.open(DashboardDetailsComponent, {
      data: { cardType },
      width: '900px',
      autoFocus: false
    });
  }

  navigateToAppointments() {
    this.router.navigate(['/appointment']);
  }

  navigateToBookAppointment() {
    this.router.navigate(['/appointment']);
  }

  navigateToMessages() {
    this.router.navigate(['/chat']);
  }

  approveAppointmentRequest(request: AppointmentRequest) {
    // Handle approval logic
    this.appointmentRequests = this.appointmentRequests.filter(r => r.id !== request.id);
  }

  rejectAppointmentRequest(request: AppointmentRequest) {
    // Handle rejection logic
    this.appointmentRequests = this.appointmentRequests.filter(r => r.id !== request.id);
  }

  rescheduleAppointmentRequest(request: AppointmentRequest) {
    // Handle reschedule logic - navigate to appointment reschedule page
    this.router.navigate(['/appointment'], { queryParams: { reschedule: request.id } });
  }

  callPatient(phoneNumber?: string) {
    if (phoneNumber && typeof globalThis !== 'undefined' && globalThis.location) {
      globalThis.location.href = `tel:${phoneNumber}`;
    }
  }

  openChat(patientId: number) {
    this.router.navigate(['/chat'], { queryParams: { patientId } });
  }

  viewPatientProfile() {
    if (this.nextPatient?.id) {
      this.router.navigate(['/patient', this.nextPatient.id]);
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'CONFIRMED': 'status-confirmed',
      'CANCELLED': 'status-cancelled',
      'HIGH': 'priority-high',
      'MEDIUM': 'priority-medium',
      'LOW': 'priority-low',
      'PAID': 'payment-paid',
      'UNPAID': 'payment-unpaid'
    };
    
    // Handle PENDING status separately for different contexts
    if (status === 'PENDING') {
      // This will be handled in the template with specific class
      return 'status-pending';
    }
    
    return statusMap[status] || '';
  }

  getPaymentStatusClass(status: string): string {
    const paymentMap: { [key: string]: string } = {
      'PAID': 'payment-paid',
      'PENDING': 'payment-pending',
      'UNPAID': 'payment-unpaid'
    };
    return paymentMap[status] || '';
  }

  formatTime(dateTime: string): string {
    // Format time helper
    return dateTime;
  }
}
