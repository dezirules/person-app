import { Car } from './../types';
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  constructor() {}

  async findAll() {
    try {
      const { data } = await axios.get<Car[]>('/api/cars');
      return data;
    } catch (error) {
      throw error;
    }
  }

  async find(id_car: number) {
    try {
      const { data } = await axios.get<Car>(`/api/cars/${id_car}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async create(car: Omit<Car, 'id_car'>) {
    try {
      await axios.post('/api/cars', car);
    } catch (error) {
      throw error;
    }
  }

  async update(car: Car) {
    try {
      await axios.put(`/api/cars/${car.id_car}`, car);
    } catch (error) {
      throw error;
    }
  }

  async destroy(id_car: number) {
    try {
      await axios.delete(`/api/cars/${id_car}`);
    } catch (error) {
      throw error;
    }
  }
}
