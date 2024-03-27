import { Usuario } from './../types/Usuario';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

const URL = environment.UrlService;
const USUARIOS = URL+"usuarios";
const LEERUSUARIO = URL+"usuario/leer/";
const CREARUSUARIO = URL+"usuario/crear";
const ACTUALIZARUSUARIO = URL+"usuario/actualizar/";
const BORRARUSUARIO = URL+"usuario/borrar/";

@Injectable({
  providedIn: 'root'
})
export class UsuarioFormService {

  usuarioId?: string;

  constructor(private http : HttpClient) { }

  async getUsuarios(): Promise<Usuario[]> {
    return await fetch(USUARIOS).then(res => res.json());
  }

  addUsuario(usuario : Usuario) {
    return this.http.post<Usuario>(`${CREARUSUARIO}`,usuario);
  }

  deleteUsuario(id? : string) {
    return this.http.delete(`${BORRARUSUARIO}${id}`);
  }
    
  getUsuario(id? : string) {
    return this.http.get<Usuario>(`${LEERUSUARIO}${id}`);
  }

  updateUsuario(usuario : Usuario) {
    return this.http.put<Usuario>(`${ACTUALIZARUSUARIO}${usuario.id}`,usuario);
  }

  getUsuarioId() {
    return this.usuarioId;
  }

  setUsuarioId(id? : string) {
    this.usuarioId = id;
  }

  
}
