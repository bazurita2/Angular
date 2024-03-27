import { UsuarioFormService } from './../../../services/usuario-form.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../../types/Usuario';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuario: Usuario = { };

  constructor(private service: UsuarioFormService,private router: Router) { }

  async ngOnInit() {
    this.usuarios = await this.service.getUsuarios();
  }

  detail(id? : string){
    this.service.setUsuarioId(id);
    this.router.navigate(["detalles"]);
  }

  edit(id? : string){
    this.service.setUsuarioId(id);
    this.router.navigate(["editar"]);
  }

  delete(id? : string){
    this.service.deleteUsuario(id)
    .subscribe({
      next: (data) => console.info("envio",data),
      error: (error)=> console.error("error",error)
    }).unsubscribe();
    alert("Se borro el usuario exitosamente!");
    this.router.navigate([""]);
  }
}
