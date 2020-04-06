import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from './services/user.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  events: string[] = [];
  opened: boolean;

  constructor(
    public router: Router,
    public userService: UserService,
    private storageService: StorageService
  ) {}

  navigate(route: string) {
    this.opened = false;
    this.router.navigate([route]);
  }

  navigateTraders() {
    this.opened = false;
    let route = '/';
    const city = this.storageService.loadLocation();
    if (city) {
      route =
        '/localtraders/' + city.lat + '/' + city.lng + '/' + city.rad
          ? city.rad.toString(0)
          : '10';
    }
    this.router.navigate([route]);
  }
}
