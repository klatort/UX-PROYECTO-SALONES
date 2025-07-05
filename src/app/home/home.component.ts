import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { FormCourseComponent } from '../form-course/form-course.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('slideRight', [
      state('initial', style({
        transform: 'translateX(0)',
        opacity: 1,
      })),
      state('final', style({
        transform: 'translateX(100vw) scale(0)',
        opacity: 0,
      })),
      transition('initial <=> final', animate('300ms'))
    ]),
  ]
})

export class HomeComponent implements OnInit {
  cursos: Array<any> = [];
  animationStates = {};
  showWelcomeOverlay = false;

  constructor(private cookieService: CookieService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.updateCursos();
    this.checkFirstTimeVisit();
  }

  // Check if this is the first time the user visits the app
  checkFirstTimeVisit(): void {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      this.showWelcomeOverlay = true;
    }
  }

  // Close the welcome overlay and set the flag in local storage
  closeWelcomeOverlay(): void {
    this.showWelcomeOverlay = false;
    localStorage.setItem('hasVisitedBefore', 'true');
  }
  
  // Method kept for compatibility
  resetWelcomeOverlay(): void {
    localStorage.removeItem('hasVisitedBefore');
    this.showWelcomeOverlay = true;
  }

  updateCursos() {
    const cookieValues = Object.values(this.cookieService.getAll());
    if (cookieValues.length == 0) {
      this.cursos = null;
      return;
    }
    console.log(cookieValues);
    this.cursos = cookieValues.map(value => JSON.parse(value)).reduce((acc, curso) => {
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
  }

  openCursos(): void {
    const dialogRef = this.dialog.open(FormCourseComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.updateCursos();
    });
  }

  openLogin(): void {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.updateCursos();
    });
  }

  deleteCurso(curso): void {
    const cookieName: string = curso.carrera + curso.plan + curso.ciclo + curso.curso + curso.seccion + curso.profesor;
    this.cookieService.delete(cookieName);
    this.animationStates[curso.carrera + curso.plan + curso.ciclo + curso.curso] = 'final';

    const moreCursos = this.cursos[curso.carrera][curso.plan][curso.ciclo].length <= 1;
    console.log(this.cursos[curso.carrera][curso.plan][curso.ciclo], moreCursos);
    if (moreCursos) {
      this.animationStates[curso.carrera + curso.plan + curso.ciclo] = 'final';
      const morePlanes = Object.keys(this.cursos[curso.carrera][curso.plan]).length <= 1;
      console.log(Object.keys(this.cursos[curso.carrera][curso.plan]), morePlanes);
      if (morePlanes) {
        this.animationStates[curso.carrera + curso.plan] = 'final';
        const moreCarreras = Object.keys(this.cursos[curso.carrera]).length <= 1;
        console.log(Object.keys(this.cursos[curso.carrera]), moreCarreras);
        if (moreCarreras) {
          this.animationStates[curso.carrera] = 'final';
        }
      }
    }

    setTimeout(() => {
      this.updateCursos();
      this.animationStates = {};
    }, 400);
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
        Object.entries(cookieData).forEach(([key, value]) => {
          this.cookieService.set(key, JSON.stringify(value));
        });
        this.updateCursos();
      };
      reader.readAsText(file);
    };
    input.click();
  }

  exportCursos() {
    const cookies = this.cookieService.getAll();
    const parsedCookies = Object.keys(cookies).reduce((acc, key) => {
      acc[key] = JSON.parse(cookies[key]);
      return acc;
    }, {});

    const cookieData = JSON.stringify(parsedCookies);

    const blob = new Blob([cookieData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cursos.json';
    link.click();
    URL.revokeObjectURL(url);
  }
  
  openMap(): void {
    window.open('https://smart-campus-fisi.vercel.app', '_blank');
  }
}
