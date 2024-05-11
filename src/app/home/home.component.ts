import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { FormCourseComponent } from '../form-course/form-course.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  cursos: Array<any> = [];
  constructor(private cookieService: CookieService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.updateCursos();
  }

  updateCursos() {
    const cookieValues = Object.values(this.cookieService.getAll());
    this.cursos = cookieValues.map(value => JSON.parse(value));
    
    console.log(this.cursos);
  }

  openCursos(): void {
    const dialogRef = this.dialog.open(FormCourseComponent);
    dialogRef.afterClosed().subscribe(() => {
      // Execute your function here
      this.updateCursos();
    });
  }
}
