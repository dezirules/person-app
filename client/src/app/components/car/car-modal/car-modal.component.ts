import { Component, Input, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/car.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { toastr } from '../../toastr/toastr.component';

@Component({
  selector: 'app-car-modal',
  templateUrl: './car-modal.component.html',
  styleUrls: ['./car-modal.component.scss'],
})
export class CarModalComponent implements OnInit {
  @Input() id_car: number | undefined;

  car: any = {};
  errors: any = {};
  formattedTax = '';

  constructor(
    private _spinner: NgxSpinnerService,
    private _carService: CarService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    if (this.id_car) {
      this._spinner.show();
      this._carService
        .find(this.id_car)
        .then((car) => {
          this.car = car;
          this.formattedTax = car.tax + ' lei';
        })
        .catch(() => toastr.error('Eroare la preluarea informației!'))
        .finally(() => this._spinner.hide());
    }
  }

  save() {
    this._spinner.show();

    if (!this.id_car) {
      this._carService
        .create(this.car)
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
      this._carService
        .update(this.car)
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

  updateTax() {
    if (this.car.cylinder_capacity < 1500) {
      this.formattedTax = '50 lei';
      return (this.car.tax = 50);
    }
    if (this.car.cylinder_capacity < 2000) {
      this.formattedTax = '100 lei';
      return (this.car.tax = 100);
    }
    this.formattedTax = '200 lei';
    return (this.car.tax = 200);
  }
}
