import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly apiBase = environment.apiUrl;

  constructor(private readonly http: HttpService) {}

  /**
   * Subscribe a hospital to a catalog service
   */
  subscribe(hospitalPublicId: string, serviceId: string): Observable<any> {
    const url = `${this.apiBase}/api/subscriptions/subscribe?hospitalPublicId=${encodeURIComponent(hospitalPublicId)}&serviceId=${encodeURIComponent(serviceId)}`;
    // Backend accepts no body; send a minimal non-empty JSON string to satisfy PayloadType
    const payload = JSON.stringify({ hospitalPublicId, serviceId });
    return this.http.sendPOSTRequest(url, payload);
  }
}


