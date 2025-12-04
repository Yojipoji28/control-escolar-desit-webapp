import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MateriasService } from 'src/app/services/materias.service';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_materia: any = {};

  public editar: boolean = false;
  public idMateria: number | null = null;
  public materia: any = {};
  public errors: any = {};

  public lista_maestros: any[] = [];

  // para timepicker
  public hora_inicio_12: string = '';
  public hora_fin_12: string = '';

  public programasEducativos = [
    'Ingeniería en Ciencias de la Computación',
    'Licenciatura en Ciencias de la Computación',
    'Ingeniería en Tecnologías de la Información'
  ];

  public diasSemana = [
    { value: 'Lunes', label: 'Lunes' },
    { value: 'Martes', label: 'Martes' },
    { value: 'Miércoles', label: 'Miércoles' },
    { value: 'Jueves', label: 'Jueves' },
    { value: 'Viernes', label: 'Viernes' }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private materiasService: MateriasService,
    private maestrosService: MaestrosService
  ) { }

  ngOnInit(): void {
    // cargar lista de maestros para el mat-select
    this.obtenerMaestros();

    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idMateria = +this.activatedRoute.snapshot.params['id'];
      this.cargarMateria();
    } else {
      this.materia = this.materiasService.esquemaMateria();
    }
  }

  private obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      resp => {
        this.lista_maestros = resp;
        this.lista_maestros.forEach((m: any) => {
          m.nombre_completo = `${m.user.first_name} ${m.user.last_name}`;
        });
      },
      err => {
        console.error("Error al obtener maestros", err);
        alert("No se pudo obtener la lista de maestros");
      }
    );
  }

  private cargarMateria() {
    if (!this.idMateria) { return; }
    this.materiasService.obtenerMateriaPorID(this.idMateria).subscribe(
      resp => {
        this.materia = resp;
        // convertir campos para el formulario
        this.materia.dias = this.materia.dias ? this.materia.dias.split(',') : [];
        // convertir horas 24h -> 12h para el timepicker
        this.hora_inicio_12 = this.convertirHora24a12(this.materia.hora_inicio);
        this.hora_fin_12 = this.convertirHora24a12(this.materia.hora_fin);
      },
      err => {
        console.error("Error al cargar materia", err);
        alert("No se pudo cargar la materia");
      }
    );
  }

  public regresar() {
    this.location.back();
  }

  // ====== Manejo de días (checkbox) ======
  public toggleDia(dia: string, checked: boolean) {
    if (!this.materia.dias) {
      this.materia.dias = [];
    }
    if (checked) {
      if (!this.materia.dias.includes(dia)) {
        this.materia.dias.push(dia);
      }
    } else {
      this.materia.dias = this.materia.dias.filter((d: string) => d !== dia);
    }
  }

  public isDiaSeleccionado(dia: string): boolean {
    return this.materia.dias && this.materia.dias.includes(dia);
  }

  // ====== Timepicker (ngx-material-timepicker) ======

  public changeHoraInicio(event: string) {
    this.hora_inicio_12 = event;
    this.materia.hora_inicio = this.convertirHora12a24(event);
  }

  public changeHoraFinal(event: string) {
    this.hora_fin_12 = event;
    this.materia.hora_fin = this.convertirHora12a24(event);
  }

  public convertirHora12a24(hora12: string): string {
    if (!hora12) return '';
    const [time, modifier] = hora12.split(' ');
    if (!time || !modifier) return hora12;

    let [hours, minutes] = time.split(':').map(Number);

    if (modifier.toUpperCase() === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }

    const horasStr = hours.toString().padStart(2, '0');
    const minutosStr = minutes.toString().padStart(2, '0');

    return `${horasStr}:${minutosStr}`;
  }

  public convertirHora24a12(hora24: string): string {
    if (!hora24) return '';
    let [hours, minutes] = hora24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const horasStr = hours.toString().padStart(2, '0');
    const minutosStr = minutes.toString().padStart(2, '0');
    return `${horasStr}:${minutosStr} ${ampm}`;
  }

  // ====== Guardar / actualizar ======
  public guardar() {
    this.errors = {};
    this.errors = this.materiasService.validarMateria(this.materia, this.editar);

    if (Object.keys(this.errors).length > 0) {
      console.log("Errores en formulario de materias: ", this.errors);
      return;
    }

    // convertir días (array) a string
    this.materia.dias = this.materia.dias.join(',');

    if (this.editar) {
      this.materia.id = this.idMateria;
      this.materiasService.actualizarMateria(this.materia).subscribe(
        resp => {
          alert("Materia actualizada correctamente.");
          this.router.navigate(['/materias']);
        },
        err => {
          console.error("Error al actualizar materia", err);
          alert("No se pudo actualizar la materia.");
        }
      );
    } else {
      this.materiasService.registrarMateria(this.materia).subscribe(
        resp => {
          alert("Materia registrada correctamente.");
          this.router.navigate(['/materias']);
        },
        err => {
          console.error("Error al registrar materia", err);
          alert("No se pudo registrar la materia.");
        }
      );
    }
  }

}
