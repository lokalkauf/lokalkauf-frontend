import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Link } from './models/link';
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
    this.opened = false;
    this.router.navigate([route]);
  }
}
