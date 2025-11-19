import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';

export interface ServiceCatalogItem {
  id: string;
  serviceCode: string;
  name: string;
  description?: string;
}

export interface FeatureCatalogItem {
  id: string;
  featureCode: string;
  name: string;
  description?: string;
  serviceId: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly apiBase = environment.apiUrl;

  constructor(private readonly http: HttpService) {}

  getServices(): Observable<ServiceCatalogItem[]> {
    const url = `${this.apiBase}/api/catalog/services`;
    return this.http.sendGETRequest(url);
  }

  getFeatures(serviceId?: string): Observable<FeatureCatalogItem[]> {
    const query = serviceId ? `?serviceId=${encodeURIComponent(serviceId)}` : '';
    const url = `${this.apiBase}/api/catalog/features${query}`;
    return this.http.sendGETRequest(url);
  }
}



