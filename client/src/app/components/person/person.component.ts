import { Person } from '../../types';
import { PersonService } from './../../services/person.service';
import { Component, OnInit } from '@angular/core';
import { toastr } from '../toastr/toastr.component';
import {
  faPlus,
  faEdit,
  faTrashAlt,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonModalComponent } from './person-modal/person-modal.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent implements OnInit {
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faChevronUp = faChevronUp;
  faPlus = faPlus;
  limit = 70;
  showBackTop = '';
  persons: Person[] = [];
  loading = false;

  constructor(
    private _personService: PersonService,
    private _spinner: NgxSpinnerService,
    private _modal: NgbModal
  ) {
    SET_HEIGHT('view', 20, 'height');
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this._spinner.show();

    this._personService
      .findAll()
      .then((persons) => {
        this.persons = persons;
      })
      .catch(() => toastr.error('Eroare la preluarea informațiilor!'))
      .finally(() => {
        this._spinner.hide();
        this.loading = false;
      });
  }

  addEdit(id_person?: number) {
    const modalRef = this._modal.open(PersonModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });

    modalRef.componentInstance.id_person = id_person;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete(person: Person) {
    const modalRef = this._modal.open(ConfirmDialogComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });

    modalRef.componentInstance.title = `Ștergere informație`;
    modalRef.componentInstance.content = `
      <p class='text-center mt-1 mb-1'>
        Doriți să ștergeți persoana <b>${person.last_name} ${person.first_name}</b> având CNP-ul <b>${person.cnp}</b> ?
      </p>
    `;

    modalRef.closed.subscribe(() => {
      this._personService
        .destroy(person.id_person)
        .then(() => {
          toastr.success('Informația a fost ștearsă cu succes!');
          this.loadData();
        })
        .catch(() => toastr.error('Eroare la ștergerea informației!'));
    });
  }

  trackByPersonId(index: number, item: Person) {
    return item.id_person;
  }

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (
      document.getElementsByClassName('view-scroll-persons')[0].scrollTop > 500
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
    SCROLL_TOP('view-scroll-persons', 0);
    this.limit = 70;
  }
}
