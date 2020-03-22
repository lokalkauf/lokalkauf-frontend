import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  events: string[] = [];
  opened: boolean;

  constructor(private router: Router) {
  }

  navigate(route: string) {
    console.log(route);
    this.opened = false;
    this.router.navigate([route]);
  }
}
