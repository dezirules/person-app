export interface Car {
  id_car: number;
  brand: string;
  model: string;
  year: number;
  cylinder_capacity: number;
  tax: number;
}

export interface Person {
  id_person: number;
  first_name: string;
  last_name: string;
  cnp: string;
  age: number;
  cars: Car[];
}
