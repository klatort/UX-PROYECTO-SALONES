import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading = false;
  loginForm: FormGroup;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private readonly fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      // Show form validation errors
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    try {
      const loginData = {
        user: username,
        password: password
      };

      this.loading = true;
      const headers = {
        'Content-Type': 'application/json',
        'x-api-secret': environment.apiSecretKey,
        'x-api-key-id': environment.apiAccessKey
      };

      await lastValueFrom(this.http.post(`${environment.apiUrl}/user/login`, loginData, { headers, withCredentials: true, observe: 'response' }));
      
      // Wait for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if we have any cookies at all rather than expecting specific ones
      const cookies = this.cookieService.getAll();
      console.log('Cookies received:', Object.keys(cookies));
      
      // Log cookie security settings for debugging
      document.cookie.split(';').forEach(cookie => {
        console.log('Cookie details:', cookie.trim());
      });
      
      try {
        const { courses }: any = await lastValueFrom(this.http.get(`${environment.apiUrl}/user/cursos`, { headers, withCredentials: true }));
        
        if (courses && courses.length > 0) {
          // Store courses in cookies with proper attributes
          courses.forEach((curso: any) => { 
            const cookieName: string = curso.carrera + curso.plan + curso.ciclo + curso.curso + curso.seccion + curso.profesor;
            this.cookieService.set(cookieName, JSON.stringify(curso), undefined, '/', undefined, true, 'Strict');
          });
          
          this.snackBar.open(`${courses.length} cursos cargados correctamente`, 'Cerrar', {
            duration: 3000
          });
        } else {
          console.warn('No courses returned from API');
          this.snackBar.open('No se encontraron cursos para cargar', 'Cerrar', {
            duration: 4000
          });
        }
        
        this.dialogRef.close(true); // Pass success status
      } catch (courseError) {
        console.error('Error fetching courses:', courseError);
        this.snackBar.open('El inicio de sesión fue exitoso, pero no se pudieron cargar los cursos', 'Cerrar', {
          duration: 5000,
          panelClass: ['warning-snackbar']
        });
        this.dialogRef.close(true); // Still close dialog as login was successful
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      
      // Show user-friendly error message
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
    } finally {
      this.loading = false;
    }
  }
}