import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MateriasService } from 'src/app/services/materias.service';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {

  // === PROGRAMAS EDUCATIVOS ===
  public programasEducativos: string[] = [
    'Ingeniería en Ciencias de la Computación',
    'Licenciatura en Ciencias de la Computación',
    'Ingeniería en Tecnologías de la Información'
  ];

  // === DATOS TOTALES DE USUARIOS ===
  public totalAdmins: number = 0;
  public totalMaestros: number = 0;
  public totalAlumnos: number = 0;

  // === DATOS TOTALES DE MATERIAS ===
  public totalMateriasPorPrograma: number[] = [0, 0, 0];

  // =================================================================
  //  SECCIÓN: ANÁLISIS DE MATERIAS
  // =================================================================

  // Histograma (línea)
  public lineChartData: any = {
    labels: this.programasEducativos,
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Materias registradas por programa',
        fill: true,
        tension: 0.3,
        borderColor: '#FF5C77',
        backgroundColor: 'rgba(255, 92, 119, 0.25)',
        borderWidth: 3,
        pointRadius: 4
      }
    ]
  };

  public lineChartOption: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public lineChartPlugins: any[] = [];

  // Barras
  public barChartData: any = {
    labels: this.programasEducativos,
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Materias registradas por programa',
        backgroundColor: ['#F88406', '#FCFF44', '#82D3FB'],
      }
    ]
  };

  public barChartOption: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public barChartPlugins: any[] = [];

  // =================================================================
  //  SECCIÓN: ANÁLISIS DE USUARIOS
  //  (MISMO DISEÑO QUE LAS GRÁFICAS ORIGINALES)
  // =================================================================

  // Pastel
  public pieChartData: any = {
    labels: ['Administradores', 'Maestros', 'Alumnos'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          '#FCFF44', // Amarillo
          '#F1C8F2', // Rosa claro
          '#31E731'  // Verde
        ],
        borderWidth: 1
      }
    ]
  };

  public pieChartOption: any = {
    responsive: false,           // como en las originales
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };

  public pieChartPlugins: any[] = [DatalabelsPlugin];

  // Dona
  public doughnutChartData: any = {
    labels: ['Administradores', 'Maestros', 'Alumnos'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          '#F88406', // Naranja
          '#FCFF44', // Amarillo
          '#31E7E7'  // Cian
        ],
        borderWidth: 1
      }
    ]
  };

  public doughnutChartOption: any = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };

  public doughnutChartPlugins: any[] = [DatalabelsPlugin];

  constructor(
    private administradoresService: AdministradoresService,
    private maestrosService: MaestrosService,
    private alumnosService: AlumnosService,
    private materiasService: MateriasService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    forkJoin({
      admins: this.administradoresService.obtenerListaAdmins(),
      maestros: this.maestrosService.obtenerListaMaestros(),
      alumnos: this.alumnosService.obtenerListaAlumnos(),
      materias: this.materiasService.obtenerListaMaterias()
    }).subscribe({
      next: (resp: any) => {
        // ====== USUARIOS ======
        this.totalAdmins = Array.isArray(resp.admins) ? resp.admins.length : 0;
        this.totalMaestros = Array.isArray(resp.maestros) ? resp.maestros.length : 0;
        this.totalAlumnos = Array.isArray(resp.alumnos) ? resp.alumnos.length : 0;

        // ====== MATERIAS ======
        const materias = Array.isArray(resp.materias) ? resp.materias : [];

        this.totalMateriasPorPrograma = this.programasEducativos.map(programa =>
          materias.filter((m: any) => m.programa_educativo === programa).length
        );

        // Actualizar datasets de todas las gráficas
        this.actualizarGraficas();
      },
      error: (err) => {
        console.error('Error al cargar datos para las gráficas', err);
      }
    });
  }

  private actualizarGraficas(): void {
    // ------ Materias ------
    const materiasData = [...this.totalMateriasPorPrograma];

    this.lineChartData = {
      ...this.lineChartData,
      datasets: [
        {
          ...this.lineChartData.datasets[0],
          data: materiasData
        }
      ]
    };

    this.barChartData = {
      ...this.barChartData,
      datasets: [
        {
          ...this.barChartData.datasets[0],
          data: materiasData
        }
      ]
    };

    // ------ Usuarios ------
    const usuariosData = [
      this.totalAdmins,
      this.totalMaestros,
      this.totalAlumnos
    ];

    this.pieChartData = {
      ...this.pieChartData,
      datasets: [
        {
          ...this.pieChartData.datasets[0],
          data: usuariosData
        }
      ]
    };

    this.doughnutChartData = {
      ...this.doughnutChartData,
      datasets: [
        {
          ...this.doughnutChartData.datasets[0],
          data: usuariosData
        }
      ]
    };
  }

}
