import { Component, Input, OnInit } from '@angular/core';
import { PersonService } from './../../../services/person.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { toastr } from '../../toastr/toastr.component';
import { Cnp } from './../../../utils/cnp';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.component.scss'],
})
export class PersonModalComponent implements OnInit {
  @Input() id_person: number | undefined;

  person: any = {};
  errors: any = {};
  cars: any = [];
  selectedCars: any = [];

  constructor(
    private _spinner: NgxSpinnerService,
    private _personService: PersonService,
    private _carService: CarService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this._spinner.show();

    if (!this.id_person) {
      this._carService
        .findAll()
        .then((data) => {
          this.cars = this.addCarLabel(data);
        })
        .catch(() => toastr.error('Eroare la preluarea informației!'))
        .finally(() => this._spinner.hide());
    } else {
      Promise.all([
        this._personService.find(this.id_person),
        this._carService.findAll(),
      ])
        .then((data) => {
          this.person = data[0];
          this.cars = this.addCarLabel(data[1]);
          this.selectedCars = this.addCarLabel(this.person.cars);
        })
        .catch(() => toastr.error('Eroare la preluarea informației!'))
        .finally(() => this._spinner.hide());
    }
  }

  save() {
    this._spinner.show();

    if (!this.id_person) {
      this._personService
        .create(this.person)
        .then((data) => {
          if (data) {
            this.errors = data;
          } else {
            toastr.success('Informația a fost salvată cu succes!');
            this.activeModal.close();
          }
        })
        .catch(() => toastr.error('Eroare la salvarea informației!'))
        .finally(() => this._spinner.hide());
    } else {
      this._personService
        .update(this.person)
        .then((data) => {
          if (data) {
            this.errors = data;
          } else {
            toastr.success('Informația a fost salvată cu succes!');
            this.activeModal.close();
          }
        })
        .catch((error) => {
          toastr.error('Eroare la modificarea informației!');
        })
        .finally(() => this._spinner.hide());
    }
  }

  updateAge() {
    const cnp = new Cnp(this.person.cnp);
    this.person.age = cnp.age ?? '';
  }

  setCars(data: any) {
    this.person.cars = data;
  }

  private addCarLabel(cars: any) {
    return cars.map((car: any) => ({
      ...car,
      carLabel: `${car.brand} ${car.model}, anul ${car.year}, ${car.cylinder_capacity} cmc`,
    }));
  }
}
