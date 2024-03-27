import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  titulo = "CRUD Usuarios con GraalVM";

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  create(){
    this.router.navigate(["crear"]);
  }

  list(){
    this.router.navigate(["listar"]);
  }
}
