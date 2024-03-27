import { EditComponent } from './pages/usuario-CRUD/edit/edit.component';
import { DetailsComponent } from './pages/usuario-CRUD/details/details.component';
import { CreateComponent } from './pages/usuario-CRUD/create/create.component';
import { ListComponent } from './pages/usuario-CRUD/list/list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'listar',
        component: ListComponent
      }
    ]
  },
  {
    path: 'crear',
    component: CreateComponent
  },
  {
    path: 'detalles',
    component: DetailsComponent
  },
  {
    path: 'editar',
    component: EditComponent
  },  
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
