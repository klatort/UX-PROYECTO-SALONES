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
      const resp: any = await lastValueFrom(this.http.post(`${environment.apiUrl}/test/cursos`, loginData));

      console.log(resp.courses);

      resp.courses.forEach((curso: any) => {
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
