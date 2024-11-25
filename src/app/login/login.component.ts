import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading = false;

  constructor(private http: HttpClient, private cookieService: CookieService, private dialogRef: MatDialogRef<LoginComponent>) { }

  async login(user, password) {
    try {
      const loginData = {
        user: user,
        password: password
      };

      this.loading = true;
      const headers = {
        'Content-Type': 'application/json',
        'x-api-secret': environment.apiSecretKey,
        'x-api-key-id': environment.apiAccessKey
      };
      const loginWindow = window.open('', '_blank', 'width=500,height=500');

      if (loginWindow) {
        const response = await lastValueFrom(this.http.get(`${environment.apiUrl}/user/login`, { headers, responseType: 'text' }));
        loginWindow.document.write(response);
      }

      //const resp: any = await lastValueFrom(this.http.post(`${environment.apiUrl}/user/login`, loginData, { headers, withCredentials: true }));

      const { courses }: any = await lastValueFrom(this.http.get(`${environment.apiUrl}/user/cursos`, { headers, withCredentials: true }));

      console.log(courses);

      courses.forEach((curso: any) => {
        const cookieName: string = curso.carrera + curso.plan + curso.ciclo + curso.curso + curso.seccion + curso.profesor;
        this.cookieService.set(cookieName, JSON.stringify(curso));
      })
      this.dialogRef.close();
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  }
}
