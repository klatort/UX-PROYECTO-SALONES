import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import * as registros from '../../assets/data/registros.json';

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

  secciones = [{'numero':'1', 'profesor':'Ivan Petrlik'}, {'numero':'2', 'profesor': 'Ronald Peña'}, {'numero':'3', 'profesor':'Edward Santa Cruz'}];

  carrerasArray: string[] | undefined;
  planesArray: string[] | undefined;
  cursosArray: string[] | undefined;

  constructor(private _formBuilder: FormBuilder) { }
  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      carrera: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      plan: ['', Validators.required],
      ciclo: ['', Validators.required],
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
  }

  watchCursos() {
    let carrera: keyof typeof this.temp.carreras = this.firstFormGroup.get('carrera').value;
    let plan: keyof typeof this.temp.carreras[typeof carrera]['planes'] = this.secondFormGroup.get('plan').value;
    let ciclo = this.secondFormGroup.get('ciclo').value;
    let cursos = this.temp.carreras[carrera].planes[plan].cursos;
    this.cursosArray = cursos.filter((curso: any) => curso.ciclo as string === ciclo as string).map((curso: any) => curso.nombre as string);
  }
}
