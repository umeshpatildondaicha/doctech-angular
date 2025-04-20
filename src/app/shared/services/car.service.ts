import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Car } from '../models/car.interface';
import { MOCK_CARS } from '../constants/car.constants';

@Injectable({
    providedIn: 'root'
})
export class CarService {
    constructor() { }

    getCars(): Observable<Car[]> {
        return of(MOCK_CARS);
    }

    getCategories(): string[] {
        return [...new Set(MOCK_CARS.map(car => car.category))];
    }

    getMakes(): string[] {
        return [...new Set(MOCK_CARS.map(car => car.make))];
    }

    getYears(): number[] {
        return [...new Set(MOCK_CARS.map(car => car.year))];
    }
} 