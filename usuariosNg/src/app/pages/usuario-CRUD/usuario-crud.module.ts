import { FormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { DetailsComponent } from './details/details.component';
import { CreateComponent } from './create/create.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    CreateComponent,
    DetailsComponent,
    EditComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
})
export class UsuarioCRUDModule { }
