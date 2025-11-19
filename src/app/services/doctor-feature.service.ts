import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DoctorFeatureService {
  private readonly apiBase = environment.apiUrl;

  constructor(private readonly http: HttpService) {}

  grantFeature(doctorPublicId: string, featureId: string, hospitalPublicId: string): Observable<any> {
    const url = `${this.apiBase}/api/doctors/${encodeURIComponent(doctorPublicId)}/features/grant/${encodeURIComponent(featureId)}?hospitalPublicId=${encodeURIComponent(hospitalPublicId)}`;
    // Backend accepts no body; send a minimal non-empty JSON string to satisfy PayloadType
    const payload = JSON.stringify({ doctorPublicId, featureId, hospitalPublicId, action: 'grant' });
    return this.http.sendPOSTRequest(url, payload);
  }

  revokeFeature(doctorPublicId: string, featureId: string, hospitalPublicId: string): Observable<any> {
    const url = `${this.apiBase}/api/doctors/${encodeURIComponent(doctorPublicId)}/features/revoke/${encodeURIComponent(featureId)}?hospitalPublicId=${encodeURIComponent(hospitalPublicId)}`;
    return this.http.sendDELETERequest(url);
  }
}


