import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgcCookieConsentService } from 'ngx-cookieconsent/service';
import { UserService } from './services/user.service';
import { StorageService } from './services/storage.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  events: string[] = [];
  opened: boolean;

  constructor(
    public router: Router,
    public userService: UserService,
    private storageService: StorageService,
    private ccService: NgcCookieConsentService,
    private cookieService: CookieService,
    private analytics: AngularFireAnalytics
  ) {
    ccService.statusChange$.subscribe((x) => {
      console.log(x.status);
      if (x.status === 'allow') {
        this.cookieService.set('GAEnabled', 'true');
        this.analytics.setAnalyticsCollectionEnabled(true);
        this.analytics.logEvent(
          'Set GAEnabled Cookie - Start with Google Analytics'
        );
      }
    });
  }

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
    if (this.cookieService.get('GAEnabled') === 'true') {
      this.analytics.setAnalyticsCollectionEnabled(true);
      this.analytics.logEvent(
        'GAEnabled Cookie already true - Start with Google Analytics'
      );
    }
  }

  navigate(route: string) {
    this.opened = false;
    this.router.navigate([route]);
  }

  navigateTraders() {
    this.opened = false;
    let route = '/';
    const city = this.storageService.loadLocation();
    if (city) {
      route = `/localtraders/${city.coordinates[0]}/${city.coordinates[1]}/${
        city.radius ? city.radius.toString() : '10'
      }`;
    }
    this.router.navigate([route]);
  }
}
