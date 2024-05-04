import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LadingPageComponent } from './lading-page/lading-page.component';

const routes: Routes = [
  { path: '', component: LadingPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
