import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  events: string[] = [];
  opened: boolean;

  constructor(public router: Router, public userService: UserService) {}

  navigate(route: string) {
    this.opened = false;
    this.router.navigate([route]);
  }

  navigateTraders() {
    this.opened = false;
    let route = '/';
    const city = localStorage.getItem('city');
    if (city) {
      const cityDeser = JSON.parse(city);
      route = '/localtraders/' + cityDeser.lng + '/' + cityDeser.lat;
    }
    this.router.navigate([route]);
  }
}
