import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-lading-page',
  templateUrl: './lading-page.component.html',
  styleUrls: ['./lading-page.component.scss']
})
export class LadingPageComponent {
  constructor(private http: HttpClient) { }

  async login() {
    try {
      const loginData = {
        user: 'fabrizio.mayor',
        password: ''
      };

      const resp: any = await lastValueFrom(this.http.post('http://localhost:3000/login', loginData));
      console.log(resp.courses);
      alert('Login success');
    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  }

}
