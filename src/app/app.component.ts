import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Link } from './models/link';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  events: string[] = [];
  opened: boolean;
}
