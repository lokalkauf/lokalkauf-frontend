import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  events: string[] = [];
  opened: boolean;

  constructor(public router: Router) {
  }

  navigate(route: string) {
    console.log(route);
    this.opened = false;
    this.router.navigate([route]);
  }
}
