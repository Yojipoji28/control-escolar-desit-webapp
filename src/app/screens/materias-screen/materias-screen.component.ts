import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';


@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";

  public lista_materias: any[] = [];
  public dataSource: MatTableDataSource<MateriaTabla> = new MatTableDataSource<MateriaTabla>();
  public displayedColumns: string[] = [
    'nrc',
    'nombre_materia',
    'seccion',
    'dias',
    'horario',
    'salon',
    'programa_educativo',
    'profesor',
    'creditos',
    'acciones'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private facadeService: FacadeService,
    private materiasService: MateriasService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const token = this.facadeService.getSessionToken();
    if (token == "") {
      this.router.navigate(["/"]);
    }

    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup().trim();

    console.log('ROL EN MATERIAS:', '[' + this.rol + ']');

    this.obtenerMaterias();
  }




  public obtenerMaterias() {
    this.materiasService.obtenerListaMaterias().subscribe(
      resp => {
        this.lista_materias = resp;
        this.dataSource = new MatTableDataSource<MateriaTabla>(this.lista_materias as MateriaTabla[]);
        this.dataSource.paginator = this.paginator;
      },
      err => {
        console.error("Error al obtener materias", err);
        alert("No se pudo obtener la lista de materias");
      }
    );
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public registrarMateria() {
    this.router.navigate(['/registro-materias']);
  }

  public editar(idMateria: number) {
    this.router.navigate(['/registro-materias', idMateria]);
  }

  public delete(idMateria: number) {
    // Solo admin
    if (this.rol === 'administrador') {

      const dialogRef = this.dialog.open(EliminarUserModalComponent, {
        data: { id: idMateria, rol: 'materia' },
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.isDelete) {
          console.log("Materia eliminada");
          alert("Materia eliminada correctamente.");
          window.location.reload();
        } else {
          console.log("No se eliminó la materia");
          alert("Materia no se ha podido eliminar.");
        }
      });

    } else {
      alert("No tienes permisos para eliminar esta materia.");
    }
  }


}

export interface MateriaTabla {
  id: number;
  nrc: string;
  nombre_materia: string;
  seccion: number;
  dias: string;
  hora_inicio: string;
  hora_fin: string;
  salon: string;
  programa_educativo: string;
  profesor_nombre: string;
  creditos: number;
}
