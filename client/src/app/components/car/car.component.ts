import { Car } from './../../types';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CarService } from 'src/app/services/car.service';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import {
  faPlus,
  faEdit,
  faTrashAlt,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { CarModalComponent } from './car-modal/car-modal.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { toastr } from '../toastr/toastr.component';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
})
export class CarComponent implements OnInit {
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faChevronUp = faChevronUp;
  faPlus = faPlus;
  limit = 70;
  showBackTop = '';
  cars: Car[] = [];
  loading = false;

  constructor(
    private _carService: CarService,
    private _spinner: NgxSpinnerService,
    private _modal: NgbModal
  ) {
    SET_HEIGHT('view', 20, 'height');
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    this._spinner.show();

    try {
      const cars = await this._carService.findAll();

      this.cars = cars;
    } catch (error) {
      toastr.error('Eroare la preluarea informațiilor!');
    } finally {
      this._spinner.hide();
      this.loading = false;
    }
  }

  addEdit(id_car?: number) {
    const modalRef = this._modal.open(CarModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.id_car = id_car;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete(car: Car) {
    const modalRef = this._modal.open(ConfirmDialogComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });

    modalRef.componentInstance.title = `Ștergere informație`;
    modalRef.componentInstance.content = `
      <p class='text-center mt-1 mb-1'>
        Doriți să ștergeți mașina <b>${car.brand} ${car.model}</b> fabricată în anul <b>${car.year}</b> ?
      </p>
    `;

    modalRef.closed.subscribe(async () => {
      try {
        await this._carService.destroy(car.id_car);

        toastr.success('Informația a fost ștearsă cu succes!');
        this.loadData();
      } catch (error) {
        toastr.error('Eroare la ștergerea informației!');
      }
    });
  }

  trackByCarId(index: number, item: Car) {
    return item.id_car;
  }

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (
      document.getElementsByClassName('view-scroll-cars')[0].scrollTop > 500
    ) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-cars', 0);
    this.limit = 70;
  }
}
