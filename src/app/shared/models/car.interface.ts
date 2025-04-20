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