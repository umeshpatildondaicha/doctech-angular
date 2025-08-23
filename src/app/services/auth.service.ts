import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  username: string;
  userType: 'doctor' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const userType = localStorage.getItem('userType');
      
      if (isAuthenticated === 'true' && userType) {
        const user: User = {
          username: userType,
          userType: userType as 'doctor' | 'admin'
        };
        this.currentUserSubject.next(user);
      }
    }
  }

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === 'doctor' && password === 'doctor') {
          const user: User = { username: 'doctor', userType: 'doctor' };
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('userType', 'doctor');
            localStorage.setItem('isAuthenticated', 'true');
          }
          this.currentUserSubject.next(user);
          resolve(true);
        } else if (username === 'admin' && password === 'admin') {
          const user: User = { username: 'admin', userType: 'admin' };
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('userType', 'admin');
            localStorage.setItem('isAuthenticated', 'true');
          }
          this.currentUserSubject.next(user);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('userType');
      localStorage.removeItem('isAuthenticated');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('isAuthenticated') === 'true';
    }
    return false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserType(): 'doctor' | 'admin' | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userType = localStorage.getItem('userType');
      return userType as 'doctor' | 'admin' | null;
    }
    return null;
  }
} 