import { PersonComponent } from './components/person/person.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationComponent } from './components/information/information.component';
import { CarComponent } from './components/car/car.component';

const routes: Routes = [
  { path: 'information', component: InformationComponent },
  { path: 'persons', component: PersonComponent },
  { path: 'cars', component: CarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
