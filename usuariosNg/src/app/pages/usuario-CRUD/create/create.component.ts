import { Usuario } from './../../../types/Usuario';
import { UsuarioFormService } from './../../../services/usuario-form.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {

  usuario: Usuario = { };

  constructor(private service: UsuarioFormService,private router: Router, private location: Location) { }

  ngOnInit(): void {
    
  }

  onSubmit(usr : Usuario){
    this.service.addUsuario(usr)
    .subscribe({
      next: (data) => console.info("envio",data),
      error: (error)=> console.error("error",error)
    });
    this.router.navigate(["listar"]);
  }

  goBack(){
    this.location.back();
  }
}
