import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
import { MateriasScreenComponent } from './screens/materias-screen/materias-screen.component';


//Layouts
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { RegistroAdminComponent } from './partials/registro-admin/registro-admin.component';
import { RegistroAlumnosComponent } from './partials/registro-alumnos/registro-alumnos.component';
import { RegistroMaestrosComponent } from './partials/registro-maestros/registro-maestros.component';
import { RegistroMateriasComponent } from './partials/registro-materias/registro-materias.component';


//Angular material
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


// Paginación
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
//Para el paginator en español
import { getSpanishPaginatorIntl } from './shared/spanish-paginator-intl';

// IMPORTANTE: añade el módulo de Sidenav
import { MatSidenavModule } from '@angular/material/sidenav';

// Modulo para las gráficas
import { NgChartsModule } from 'ng2-charts';

//Ngx-cookie-service
import { CookieService } from 'ngx-cookie-service';

// Third Party Modules
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { AdminScreenComponent } from './screens/admin-screen/admin-screen.component';
import { AlumnosScreenComponent } from './screens/alumnos-screen/alumnos-screen.component';
import { MaestrosScreenComponent } from './screens/maestros-screen/maestros-screen.component';
import { NavbarUserComponent } from './partials/navbar-user/navbar-user.component';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { EliminarUserModalComponent } from './modals/eliminar-user-modal/eliminar-user-modal.component';
import { GraficasScreenComponent } from './screens/graficas-screen/graficas-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    RegistroUsuariosScreenComponent,
    AuthLayoutComponent,
    DashboardLayoutComponent,
    RegistroAdminComponent,
    RegistroAlumnosComponent,
    RegistroMaestrosComponent,
    HomeScreenComponent,
    AdminScreenComponent,
    AlumnosScreenComponent,
    MaestrosScreenComponent,
    NavbarUserComponent,
    SidebarComponent,
    EliminarUserModalComponent,
    GraficasScreenComponent,
    MateriasScreenComponent,
    RegistroMateriasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    NgChartsModule,
    MatDialogModule,
    NgxMaterialTimepickerModule
  ],
  providers: [
    CookieService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
