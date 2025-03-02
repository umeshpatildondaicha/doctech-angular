// google-calendar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarService {
  private clientId = '652617663640-r9viq2g661lv6svssojhtp34pt9bcbng.apps.googleusercontent.com'; // Replace with your Client ID
  private apiKey = 'AIzaSyASfgC-Phgy6dO-eJKKdOwrzBVJEbQXQKc'; // Replace with your API Key
  private discoveryDocs = [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  ];
  private scopes = 'https://www.googleapis.com/auth/calendar.readonly'; // Add more scopes if needed
  private eventsSubject = new BehaviorSubject<any[]>([]);
  events$ = this.eventsSubject.asObservable();

  constructor() {
    this.initClient();
  }

  private initClient() {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: this.apiKey,
          clientId: this.clientId,
          discoveryDocs: this.discoveryDocs,
          scope: this.scopes,
        })
        .then(() => {
          console.log('Google API Client Initialized');
          gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus.bind(this));
          this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        })
        .catch((error: any) => console.error('Error initializing GAPI:', error));
    });
  }

  private updateSignInStatus(isSignedIn: boolean) {
    if (isSignedIn) {
      this.fetchEvents();
    }
  }

  signIn() {
    return gapi.auth2.getAuthInstance().signIn();
  }

  signOut() {
    return gapi.auth2.getAuthInstance().signOut();
  }

  fetchEvents() {
    gapi.client.calendar.events
      .list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
      })
      .then((response: any) => {
        const events = response.result.items;
        this.eventsSubject.next(events);
        console.log('Fetched Events:', events);
      })
      .catch((error: any) => console.error('Error fetching events:', error));
  }
}