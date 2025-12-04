import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResumenUsuarios {
  administradores: number;
  maestros: number;
  alumnos: number;
}

@Injectable({
  providedIn: 'root'
})
export class GraficasService {

  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  public obtenerResumenUsuarios(): Observable<ResumenUsuarios> {
    return this.http.get<ResumenUsuarios>(
      `${this.baseUrl}/graficas/resumen-usuarios/`
    );
  }
}
