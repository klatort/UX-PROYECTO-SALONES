import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { FormCourseComponent } from '../form-course/form-course.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  constructor(private cookieService: CookieService, public dialog: MatDialog) { }
  openCursos(): void {
    this.dialog.open(FormCourseComponent);
  }
}
