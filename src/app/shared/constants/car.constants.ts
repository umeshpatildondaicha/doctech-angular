export interface Car {
    make: string;
    model: string;
    price: number;
    year: number;
    category: string;
    status: string;
    version: string;
    [key: string]: string | number;
}

export const MOCK_CARS: Car[] = [
    {
        make: 'Toyota',
        model: 'Camry',
        price: 25000,
        year: 2023,
        category: 'Sedan',
        status: 'Published',
        version: 'v-1'
    },
    {
        make: 'Honda',
        model: 'Civic',
        price: 22000,
        year: 2023,
        category: 'Sedan',
        status: 'Published',
        version: 'v-1'
    },
    {
        make: 'Tesla',
        model: 'Model 3',
        price: 45000,
        year: 2023,
        category: 'Electric',
        status: 'Published',
        version: 'v-1'
    },
    {
        make: 'BMW',
        model: 'X5',
        price: 65000,
        year: 2023,
        category: 'SUV',
        status: 'Published',
        version: 'v-1'
    },
    {
        make: 'Mercedes',
        model: 'C-Class',
        price: 55000,
        year: 2023,
        category: 'Luxury',
        status: 'Published',
        version: 'v-1'
    }
]; 