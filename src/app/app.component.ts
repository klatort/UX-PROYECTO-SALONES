import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'horario';
  loading = false;

  constructor(private router: Router) {
    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.loading = true;
      }

      if (routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationError) {
        setTimeout(() => {
          this.loading = false;
        }, 1000 + Math.random() * 2000);
      }
    })
  }
}
