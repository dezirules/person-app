import { yearValidator } from './../../../validators/yearValidator';
import { Car } from './../../../types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  carForm: FormGroup = this._fb.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    year: [
      '',
      [Validators.required, Validators.pattern('\\d*'), yearValidator()],
    ],
    cylinder_capacity: ['', [Validators.required, Validators.pattern('\\d*')]],
    tax: ['', Validators.required],
  });

  car: any = {};

  constructor(
    private _spinner: NgxSpinnerService,
    private _carService: CarService,
    private _fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.cylinder_capacity?.valueChanges.subscribe((value) =>
      this.updateTax(value)
    );

    if (this.id_car) {
      this._spinner.show();

      try {
        const car = await this._carService.find(this.id_car);

        this.car = car;
        this.carForm.setValue({
          brand: car.brand,
          model: car.model,
          year: car.year,
          cylinder_capacity: car.cylinder_capacity,
          tax: car.tax + ' lei',
        });
      } catch (error) {
        toastr.error('Eroare la preluarea informației!');
      } finally {
        this._spinner.hide();
      }
    }
  }

  async save() {
    const car = {
      id_car: this.id_car,
      brand: this.brand?.value,
      model: this.model?.value,
      year: this.year?.value,
      cylinder_capacity: this.cylinder_capacity?.value,
      tax: this.car?.tax,
    };

    this._spinner.show();

    if (!this.id_car) {
      try {
        await this._carService.create(car);

        toastr.success('Informația a fost salvată cu succes!');
        this.activeModal.close();
      } catch (error) {
        toastr.error('Eroare la salvarea informației!');
      } finally {
        this._spinner.hide();
      }
    } else {
      try {
        await this._carService.update(car as Car);

        toastr.success('Informația a fost salvată cu succes!');
        this.activeModal.close();
      } catch (error) {
        toastr.error('Eroare la modificarea informației!');
      } finally {
        this._spinner.hide();
      }
    }
  }

  private updateTax(cylinder_capacity: string) {
    const cc = parseInt(cylinder_capacity);

    if (isNaN(cc)) return;

    if (cc < 1500) {
      this.tax?.setValue('50 lei');
      return (this.car.tax = 50);
    }

    if (cc < 2000) {
      this.tax?.setValue('100 lei');
      return (this.car.tax = 100);
    }

    this.tax?.setValue('200 lei');
    return (this.car.tax = 200);
  }

  get brand() {
    return this.carForm.get('brand');
  }

  get model() {
    return this.carForm.get('model');
  }

  get year() {
    return this.carForm.get('year');
  }

  get cylinder_capacity() {
    return this.carForm.get('cylinder_capacity');
  }

  get tax() {
    return this.carForm.get('tax');
  }
}
