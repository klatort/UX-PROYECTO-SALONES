import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import * as registros from '../../assets/data/registros.json';
import { CookieService } from 'ngx-cookie-service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-course',
  templateUrl: './form-course.component.html',
  styleUrls: ['./form-course.component.scss']
})
export class FormCourseComponent implements OnInit {
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  temp = registros;

  firstFormGroup: any = null;
  secondFormGroup: any = null;
  thirdFormGroup: any = null;

  secciones = [{ 'numero': '1', 'profesor': 'Ivan Petrlik' }, { 'numero': '2', 'profesor': 'Ronald Peña' }, { 'numero': '3', 'profesor': 'Edward Santa Cruz' }];
  ciclos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'electivo'];

  carrerasArray: string[] | undefined;
  planesArray: string[] | undefined;
  cursosArray: string[] | undefined;

  constructor(private _formBuilder: FormBuilder, private cookieService: CookieService, public dialogRef: MatDialogRef<FormCourseComponent>
  ) { }
  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      carrera: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      plan: ['', Validators.required],
      ciclo: [{ value: '', disabled: true }, Validators.required],
    });

    this.secondFormGroup.get('plan').valueChanges.subscribe((value: string) => {
      console.log(value)
      if (value) {
        this.secondFormGroup.get('ciclo').enable();
      } else {
        this.secondFormGroup.get('ciclo').disable();
        this.secondFormGroup.get('ciclo').setValue('');
      }
    });

    this.thirdFormGroup = this._formBuilder.group({
      curso: ['', Validators.required]
    });

    console.log(this.temp);
    this.carrerasArray = Object.keys(this.temp.carreras) as string[];
  }
  watchPlanes() {
    console.log(this.firstFormGroup.get('carrera').value)
    let carrera: keyof typeof this.temp.carreras = this.firstFormGroup.get('carrera').value;
    this.planesArray = Object.keys(this.temp.carreras[carrera].planes);
    this.secondFormGroup.get('plan').setValue('');
  }

  watchCursos() {
    let carrera: keyof typeof this.temp.carreras = this.firstFormGroup.get('carrera').value;
    let plan: keyof typeof this.temp.carreras[typeof carrera]['planes'] = this.secondFormGroup.get('plan').value;
    let ciclo = this.secondFormGroup.get('ciclo').value;
    if (ciclo == 'electivo') {
      this.cursosArray = this.temp.carreras[carrera].planes[plan].cursos.filter((curso: any) => curso.ciclo == null).map((curso: any) => curso.nombre as string);
      return;
    }
    let cursos = this.temp.carreras[carrera].planes[plan].cursos;
    this.cursosArray = cursos.filter((curso: any) => curso.ciclo == ciclo).map((curso: any) => curso.nombre as string);
    console.log(this.cursosArray);
  }

  addCurso() {
    const curso = {
      'carrera': this.firstFormGroup.get('carrera').value,
      'plan': this.secondFormGroup.get('plan').value,
      'ciclo': this.secondFormGroup.get('ciclo').value,
      'curso': this.thirdFormGroup.get('curso').value.curso,
      'seccion': this.thirdFormGroup.get('curso').value.seccion,
      'profesor': this.thirdFormGroup.get('curso').value.profesor,
    };
    const cookieName: string = curso.carrera + curso.plan + curso.ciclo + curso.curso + curso.seccion + curso.profesor;
    this.cookieService.set(cookieName, JSON.stringify(curso));
    this.dialogRef.close();
  }
}
