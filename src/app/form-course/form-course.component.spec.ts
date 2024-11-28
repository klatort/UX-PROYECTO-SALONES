import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { FormCourseComponent } from './form-course.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FormCourseComponent', () => {
  let component: FormCourseComponent;
  let fixture: ComponentFixture<FormCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormCourseComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatChipsModule,
        MatExpansionModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatStepperModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatRadioModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        CookieService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a first form group', () => {
    expect(component.firstFormGroup).toBeDefined();
  });

  it('should have a second form group', () => {
    expect(component.secondFormGroup).toBeDefined();
  });

  it('should have a third form group', () => {
    expect(component.thirdFormGroup).toBeDefined();
  });

  it('should enable ciclo control when plan is selected', () => {
    component.secondFormGroup.controls['plan'].setValue('somePlan');
    expect(component.secondFormGroup.controls['ciclo'].enabled).toBeTruthy();
  });

  it('should disable ciclo control when plan is not selected', () => {
    component.secondFormGroup.controls['plan'].setValue('');
    expect(component.secondFormGroup.controls['ciclo'].disabled).toBeTruthy();
  });

  it('should populate carrerasArray on init', () => {
    component.ngOnInit();
    expect(component.carrerasArray).toBeDefined();
    expect(component.carrerasArray.length).toBeGreaterThan(0);
  });

  it('should populate planesArray when watchPlanes is called', () => {
    component.firstFormGroup.controls['carrera'].setValue('Ingeniería en Sistemas');
    component.watchPlanes();
    expect(component.planesArray).toBeDefined();
    expect(component.planesArray.length).toBeGreaterThan(0);
  });

  it('should populate cursosArray when watchCursos is called', () => {
    component.firstFormGroup.controls['carrera'].setValue('Ingeniería en Sistemas');
    component.secondFormGroup.controls['plan'].setValue('2014');
    component.secondFormGroup.controls['ciclo'].setValue(1);
    component.watchCursos();
    expect(component.cursosArray).toBeDefined();
    expect(component.cursosArray.length).toBeGreaterThan(0);
  });

  it('should add a course and set a cookie when addCurso is called', () => {
    spyOn(component.cookieService, 'set');

    component.firstFormGroup.controls['carrera'].setValue('Ingeniería en Sistemas');
    component.secondFormGroup.controls['plan'].setValue('2014');
    component.secondFormGroup.controls['ciclo'].setValue(1);
    component.thirdFormGroup.controls['curso'].setValue({
      curso: 'MATEMÁTICA BÁSICA I',
      seccion: '1',
      profesor: 'Ivan Petrlik'
    });

    component.addCurso();

    expect(component.cookieService.set).toHaveBeenCalled();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});