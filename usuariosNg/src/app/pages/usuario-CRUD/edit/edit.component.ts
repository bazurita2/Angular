import { Usuario } from './../../../types/Usuario';
import { UsuarioFormService } from './../../../services/usuario-form.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  usuario: Usuario = { };

  constructor(private service: UsuarioFormService,private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.service.getUsuario(this.service.getUsuarioId())
    .subscribe({
      next: (data) => {this.usuario=data,console.info("envio",data)},
      error: (error)=> console.error("error",error)
    });
  }

  onSubmit(usr : Usuario){
    this.service.updateUsuario(usr)
    .subscribe({
      next: (data) => console.info("envio",data),
      error: (error)=> console.error("error",error)
    });
    this.router.navigate([""]);
  }

  goBack(){
    this.location.back();
  }
}
