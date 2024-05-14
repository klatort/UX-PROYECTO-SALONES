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
    console.log(cookieValues);
    if (cookieValues.length == 0) {
      this.cursos = null;
      return;
    }
    this.cursos = cookieValues.map(value => JSON.parse(value));

    this.cursos = this.cursos.reduce((acc, curso) => {
      if (!acc[curso.carrera]) {
        acc[curso.carrera] = {};
      }
      if (!acc[curso.carrera][curso.plan]) {
        acc[curso.carrera][curso.plan] = {};
      }
      if (!acc[curso.carrera][curso.plan][curso.ciclo]) {
        acc[curso.carrera][curso.plan][curso.ciclo] = [];
      }
      acc[curso.carrera][curso.plan][curso.ciclo].push(curso);
      return acc;
    }, {});
    console.log(this.cursos);
  }

  openCursos(): void {
    const dialogRef = this.dialog.open(FormCourseComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.updateCursos();
    });
  }

  deleteCurso(curso): void {
    console.log(this.cookieService.getAll());
    const cookieName: string = curso.carrera + curso.plan + curso.ciclo + curso.curso + curso.seccion + curso.profesor;
    this.cookieService.delete(cookieName);
    this.updateCursos();
  }
  importCursos() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files[0];
      const reader = new FileReader();
      reader.onload = () => {
      const cookieData = JSON.parse(reader.result as string);
      console.log(cookieData);
      Object.entries(cookieData).forEach(([key, value]) => {
        console.log(key, JSON.stringify(value));
        this.cookieService.set(key, JSON.stringify(value));
      });
      this.updateCursos();
      };
      reader.readAsText(file);
    };
    input.click();
    this.updateCursos();
  }
  exportCursos() {
    const cookieData = JSON.stringify(this.cookieService.getAll());
    const blob = new Blob([cookieData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cursos.json';
    link.click();
    URL.revokeObjectURL(url);
  }
}
