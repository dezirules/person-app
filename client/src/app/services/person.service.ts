import { Person } from '../types';
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  constructor() {}

  async findAll() {
    try {
      const { data } = await axios.get<Person[]>('/api/persons');
      return data;
    } catch (error) {
      throw error;
    }
  }

  async find(id_person: number) {
    try {
      const { data } = await axios.get<Person>(`/api/persons/${id_person}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async create(person: Omit<Person, 'id_person'>) {
    try {
      const data = {
        ...person,
        cars: person?.cars?.map(({ id_car }) => id_car) ?? [],
      };

      await axios.post('/api/persons', data);
    } catch (error: any) {
      if (error.response.status === 400) return error.response.data.errors;
      throw error;
    }
  }

  async update(person: Person) {
    const data = {
      ...person,
      cars: person?.cars?.map(({ id_car }) => id_car) ?? [],
    };

    try {
      await axios.put(`/api/persons/${person.id_person}`, data);
    } catch (error: any) {
      if (error.response.status === 400) return error.response.data.errors;
      throw error;
    }
  }

  async destroy(id_person: number) {
    try {
      await axios.delete(`/api/persons/${id_person}`);
    } catch (error) {
      throw error;
    }
  }
}
