import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomEventsService {

  breadcrumbEvent = new EventEmitter<any>();
  
  constructor() { }
}
