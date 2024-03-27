import { UsuarioFormService } from './../../../services/usuario-form.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../../types/Usuario';
import { Location } from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
})
export class DetailsComponent implements OnInit {

  usuario : Usuario = { };

  constructor(private service: UsuarioFormService,private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.service.getUsuario(this.service.getUsuarioId())
    .subscribe({
      next: (data) => {this.usuario=data,console.info("envio",data)},
      error: (error)=> console.error("error",error)
    });
  }

  goBack(){
    this.location.back();
  }
}
