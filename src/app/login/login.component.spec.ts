import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        CookieService,
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a login form', () => {
    expect(component.loginForm).toBeDefined();
  });

  it('should have a login method', () => {
    expect(component.login).toBeDefined();
  });

  it('should not allow SQL injection in the username', () => {
    component.loginForm.controls['username'].setValue("'; DROP TABLE users; --");
    component.loginForm.controls['password'].setValue('password');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should not allow special characters in the username', () => {
    component.loginForm.controls['username'].setValue('user@name');
    component.loginForm.controls['password'].setValue('password');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should allow valid username and password', () => {
    component.loginForm.controls['username'].setValue('username');
    component.loginForm.controls['password'].setValue('password');
    expect(component.loginForm.valid).toBeTruthy();
  });
});