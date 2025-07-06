import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Course {
  carrera: string;
  plan: string;
  ciclo: string;
  curso: string;
  seccion: string;
  profesor: string;
  horario: string | number;
  aula?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading = false;
  loginForm: FormGroup;
  
  private readonly timeSlots = [
    '08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', 
    '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'
  ];
  
  private readonly defaultHeaders = {
    'Content-Type': 'application/json',
    'x-api-secret': environment.apiSecretKey,
    'x-api-key-id': environment.apiAccessKey
  };

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    try {
      this.loading = true;
      
      await lastValueFrom(
        this.http.post(
          `${environment.apiUrl}/user/login`, 
          { user: username, password }, 
          { headers: this.defaultHeaders, withCredentials: true, observe: 'response' }
        )
      );
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.fetchAndProcessCourses();
      this.dialogRef.close(true);
      
    } catch (error: any) {
      this.handleLoginError(error);
    } finally {
      this.loading = false;
    }
  }
  
  private async fetchAndProcessCourses(): Promise<void> {
    let response;
    
    try {
      response = await lastValueFrom<{courses: Course[]}>(
        this.http.get<{courses: Course[]}>(
          `${environment.apiUrl}/user/cursos`, 
          { headers: this.defaultHeaders, withCredentials: true }
        )
      );
    } catch {
      this.showWarningMessage('El inicio de sesión fue exitoso, pero no se pudieron cargar los cursos');
      return;
    }
    
    const { courses } = response;
    
    if (courses?.length > 0) {
      this.processCourses(courses);
      this.showSuccessMessage(courses.length);
    } else {
      this.showWarningMessage('No se encontraron cursos para cargar');
    }
  }
  
  private processCourses(courses: Course[]): void {
    courses.forEach(curso => {
      curso.horario = this.formatHorario(curso.horario);
      
      const cookieName = curso.carrera + curso.plan + curso.ciclo + curso.curso + curso.seccion + curso.profesor;
      this.cookieService.set(cookieName, JSON.stringify(curso), undefined, '/', undefined, true, 'Strict');
    });
  }
  
  private formatHorario(horario: string | number): string {
    if (horario === 0 || horario === null || horario === undefined) {
      return '10:00 - 12:00';
    } else if (typeof horario === 'number') {
      return this.timeSlots[horario % this.timeSlots.length];
    }
    return horario;
  }
  
  private showSuccessMessage(count: number): void {
    this.snackBar.open(`${count} cursos cargados correctamente`, 'Cerrar', {
      duration: 3000
    });
  }
  
  private showWarningMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['warning-snackbar']
    });
  }
  
  private handleLoginError(error: any): void {
    let errorMessage = 'Ocurrió un error al iniciar sesión';
    
    if (error.status === 401) {
      errorMessage = 'Credenciales incorrectas. Por favor, inténtelo de nuevo.';
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar al servidor. Verifique su conexión.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    this.snackBar.open(errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}