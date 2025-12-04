import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    private http: HttpClient,
    private facadeService: FacadeService,
    private errorService: ErrorsService,
    private validatorService: ValidatorService
  ) { }

  // Esquema base de materia
  public esquemaMateria() {
    return {
      id: null,
      nrc: '',
      nombre_materia: '',
      seccion: '',
      dias: [],               // array en el front, luego se convierte a string
      hora_inicio: '',
      hora_fin: '',
      salon: '',
      programa_educativo: '',
      profesor: null,         // id del maestro
      creditos: '',
    };
  }

  // Validación completa según el PDF
  public validarMateria(materia: any, editar: boolean = false): any {
    const errors: any = {};

    // 1. NRC: numérico, 6 dígitos, requerido
    const nrc = (materia.nrc ?? '').toString().trim();
    if (!nrc) {
      errors.nrc = 'El NRC es obligatorio.';
    } else {
      const nrcRegex = /^[0-9]{6}$/;  // aquí fijamos 6 dígitos
      if (!nrcRegex.test(nrc)) {
        errors.nrc = 'El NRC debe contener exactamente 6 dígitos numéricos.';
      }
    }
    // La verificación de NRC único la hace el backend (campo unique en el modelo).

    // 2. Nombre de la materia: obligatorio, solo letras y espacios
    const nombre = (materia.nombre_materia ?? '').toString().trim();
    if (!nombre) {
      errors.nombre_materia = 'El nombre de la materia es obligatorio.';
    } else {
      const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$/;
      if (!nombreRegex.test(nombre)) {
        errors.nombre_materia =
          'El nombre solo puede contener letras y espacios, sin números ni caracteres especiales.';
      }
    }

    // 3. Sección: solo numérica, máximo 3 dígitos, > 0
    const seccionStr = (materia.seccion ?? '').toString().trim();
    if (!seccionStr) {
      errors.seccion = 'La sección es obligatoria.';
    } else {
      const seccionRegex = /^[0-9]{1,3}$/;
      if (!seccionRegex.test(seccionStr)) {
        errors.seccion = 'La sección debe ser un número de hasta 3 dígitos.';
      } else {
        const seccionNum = parseInt(seccionStr, 10);
        if (seccionNum <= 0) {
          errors.seccion = 'La sección debe ser un número positivo.';
        }
      }
    }

    // 4. Días de la semana: al menos uno
    if (!materia.dias || !Array.isArray(materia.dias) || materia.dias.length === 0) {
      errors.dias = 'Debes seleccionar al menos un día.';
    }

    // 5. Horario: hora inicio < hora fin y ambas presentes
    const hInicio = (materia.hora_inicio ?? '').toString().trim(); // formato "HH:MM"
    const hFin = (materia.hora_fin ?? '').toString().trim();

    if (!hInicio) {
      errors.hora_inicio = 'La hora de inicio es obligatoria.';
    }
    if (!hFin) {
      errors.hora_fin = 'La hora de finalización es obligatoria.';
    }

    if (hInicio && hFin) {
      const [hiH, hiM] = hInicio.split(':').map((x: string) => parseInt(x, 10));
      const [hfH, hfM] = hFin.split(':').map((x: string) => parseInt(x, 10));

      const minutosInicio = hiH * 60 + hiM;
      const minutosFin = hfH * 60 + hfM;

      if (isNaN(minutosInicio) || isNaN(minutosFin)) {
        if (!errors.hora_inicio) {
          errors.hora_inicio = 'Formato de hora de inicio inválido.';
        }
        if (!errors.hora_fin) {
          errors.hora_fin = 'Formato de hora de finalización inválido.';
        }
      } else if (minutosInicio >= minutosFin) {
        errors.hora_inicio = 'La hora de inicio debe ser menor que la hora de finalización.';
        errors.hora_fin = 'La hora de finalización debe ser mayor que la hora de inicio.';
      }
    }

    // 6. Salón: alfanumérico + espacios, máx. 15 caracteres
    const salon = (materia.salon ?? '').toString().trim();
    if (!salon) {
      errors.salon = 'El salón es obligatorio.';
    } else {
      const salonRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÜüÑñ ]+$/;
      if (!salonRegex.test(salon)) {
        errors.salon = 'El salón solo puede contener letras, números y espacios.';
      } else if (salon.length > 15) {
        errors.salon = 'El salón no debe exceder 15 caracteres.';
      }
    }

    // 7. Programa educativo: obligatorio
    if (!materia.programa_educativo) {
      errors.programa_educativo = 'El programa educativo es obligatorio.';
    }

    // 8. Profesor asignado: obligatorio
    if (!materia.profesor) {
      errors.profesor = 'Debes seleccionar un profesor.';
    }

    // 9. Créditos: números enteros positivos, máximo 2 dígitos
    const creditosStr = (materia.creditos ?? '').toString().trim();
    if (!creditosStr) {
      errors.creditos = 'Los créditos son obligatorios.';
    } else {
      const creditosRegex = /^[0-9]{1,2}$/;
      if (!creditosRegex.test(creditosStr)) {
        errors.creditos = 'Los créditos deben ser un número entero positivo de hasta 2 dígitos.';
      } else {
        const creditosNum = parseInt(creditosStr, 10);
        if (creditosNum <= 0) {
          errors.creditos = 'Los créditos deben ser mayores que cero.';
        }
      }
    }

    return errors;
  }

  // ====== Servicios HTTP ======

  private getAuthHeaders(): HttpHeaders {
    const token = this.facadeService.getSessionToken();
    if (token) {
      return new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    }
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  public registrarMateria(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${environment.url_api}/materias/`, data, { headers });
  }

  public obtenerListaMaterias(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, { headers });
  }

  public obtenerMateriaPorID(idMateria: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${environment.url_api}/materias/?id=${idMateria}`, { headers });
  }

  public actualizarMateria(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${environment.url_api}/materias/`, data, { headers });
  }

  public eliminarMateria(idMateria: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${environment.url_api}/materias/${idMateria}/`, { headers });
  }

}
