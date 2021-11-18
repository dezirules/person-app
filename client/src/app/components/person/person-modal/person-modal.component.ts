import { Car, Person } from './../../../types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { PersonService } from './../../../services/person.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { toastr } from '../../toastr/toastr.component';
import { Cnp } from './../../../utils/cnp';
import { CarService } from 'src/app/services/car.service';
import { cnpValidator } from 'src/app/validators/cnpValidator';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.component.scss'],
})
export class PersonModalComponent implements OnInit {
  @Input() id_person: number | undefined;

  personForm: FormGroup = this._fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    cnp: ['', [Validators.required, cnpValidator()]],
    age: ['', Validators.required],
    selectedCarsIds: [],
  });

  person: any = {};
  cars: Car[] = [];
  errors: { [key: string]: string } = {};

  constructor(
    private _spinner: NgxSpinnerService,
    private _personService: PersonService,
    private _carService: CarService,
    private _fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.cnp?.valueChanges.subscribe((cnp) => this.updateAge(cnp));

    this._spinner.show();

    try {
      if (!this.id_person) {
        const cars = await this._carService.findAll();

        this.cars = this.addCarLabel(cars);
      } else {
        const data = await Promise.all([
          this._personService.find(this.id_person),
          this._carService.findAll(),
        ]);

        this.person = data[0];
        this.cars = this.addCarLabel(data[1]);
        this.personForm.setValue({
          first_name: data[0].first_name,
          last_name: data[0].last_name,
          cnp: data[0].cnp,
          age: data[0].age,
          selectedCarsIds: data[0].cars.map(({ id_car }) => id_car),
        });
      }
    } catch (error) {
      () => toastr.error('Eroare la preluarea informației!');
    } finally {
      this._spinner.hide();
    }
  }

  async save() {
    const person = {
      id_person: this.id_person,
      first_name: this.first_name?.value,
      last_name: this.last_name?.value,
      cnp: this.cnp?.value,
      age: this.age?.value,
      cars: this.cars.filter(({ id_car }) =>
        this.selectedCarsIds?.value?.includes(id_car)
      ),
    };

    this._spinner.show();

    if (!this.id_person) {
      try {
        const errors = await this._personService.create(person);

        if (errors) {
          this.errors = errors;
        } else {
          toastr.success('Informația a fost salvată cu succes!');
          this.activeModal.close();
        }
      } catch (error) {
        toastr.error('Eroare la salvarea informației!');
      } finally {
        this._spinner.hide();
      }
    } else {
      try {
        const errors = await this._personService.update(person as Person);

        if (errors) {
          this.errors = errors;
        } else {
          toastr.success('Informația a fost salvată cu succes!');
          this.activeModal.close();
        }
      } catch (error) {
        toastr.error('Eroare la modificarea informației!');
      } finally {
        this._spinner.hide();
      }
    }
  }

  private updateAge(cnp: string) {
    const newCnp = new Cnp(cnp);

    this.age?.setValue(newCnp.age ?? '');
  }

  private addCarLabel(cars: Car[]) {
    return cars.map((car) => ({
      ...car,
      carLabel: `${car.brand} ${car.model}, ${car.year}, ${car.cylinder_capacity} cmc`,
    }));
  }

  get first_name() {
    return this.personForm.get('first_name');
  }

  get last_name() {
    return this.personForm.get('last_name');
  }

  get cnp() {
    return this.personForm.get('cnp');
  }

  get age() {
    return this.personForm.get('age');
  }

  get selectedCarsIds() {
    return this.personForm.get('selectedCarsIds');
  }

  clearErrors() {
    this.errors = {};
  }
}
