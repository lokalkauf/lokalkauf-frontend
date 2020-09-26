import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { UserService } from './services/user.service';
import { StorageService } from './services/storage.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { CookieService } from 'ngx-cookie-service';
import { BookmarksService, LocalBookmark, ActiveBookmark, BOOKMARK_TYPE } from './services/bookmarks.service';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { BookmarksDialogComponent } from './customer/bookmarks-dialog/bookmarks-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  events: string[] = [];
  opened: boolean;
  bookmarks: Observable<number>;
  faFacebookF = faFacebookF;
  faInstagram = faInstagram;

  localBookmarks: Observable<LocalBookmark[]>;
  localPublicBookmarks: Observable<LocalBookmark[]>;
  currentBookmark: ActiveBookmark;

  constructor(
    public router: Router,
    public userService: UserService,
    private storageService: StorageService,
    private bookmarkService: BookmarksService,
    private ccService: NgcCookieConsentService,
    private cookieService: CookieService,
    private analytics: AngularFireAnalytics,
    public dialog: MatDialog
  ) {
    ccService.statusChange$.subscribe((x) => {
      if (x.status === 'allow') {
        this.cookieService.set('GAEnabled', 'true');
        this.analytics.setAnalyticsCollectionEnabled(true);
        this.analytics.logEvent('enable_analytics');
      } else {
        const domain = window.location.host.split(':')[0];
        const domainDot = '.' + domain;
        const domainDotWww = '.www' + domain;
        this.analytics.logEvent('disable_analytics');
        this.analytics.setAnalyticsCollectionEnabled(false);

        cookieService.deleteAll();
        cookieService.deleteAll('/', domain);
        cookieService.deleteAll('/', domainDotWww);
        cookieService.deleteAll('/', domainDot);
        cookieService.deleteAll('/', '.lokalkauf.org');
        cookieService.deleteAll('/', '.www.lokalkauf.org');
        cookieService.deleteAll('/', 'www.lokalkauf.org');

        const date = new Date().getDate() + 1;
        cookieService.set('cookieconsent_status', 'deny', date, '/', domainDot, undefined, 'Strict');
      }
    });

    this.bookmarkService.bookmarkSubject.subscribe((traderCount) => (this.bookmarks = of(traderCount)));

    this.currentBookmark = this.storageService.loadActiveBookmarkId();
    if (this.currentBookmark) {
      if (this.currentBookmark.type === BOOKMARK_TYPE.PUBLIC) {
        this.bookmarkService.loadPublicBookmarkList(this.currentBookmark.id, true).subscribe();
      } else {
        this.bookmarkService.loadBookmarkList(this.currentBookmark.id).subscribe();
      }
    }

    this.bookmarkService.currentBookmarklist.subscribe((x) => {
      this.currentBookmark = this.storageService.loadActiveBookmarkId();
      this.localBookmarks = of(this.bookmarkService.getLocalBookmarkLists());
      this.localPublicBookmarks = of(this.bookmarkService.getLocalPublicBookmarklists());
    });
  }

  loadBookmarkList(id: string) {
    if (id && id.length > 0) {
      this.storageService.saveActiveBookmarkId({
        id,
        type: BOOKMARK_TYPE.PRIVATE,
      });

      this.currentBookmark = { id, type: BOOKMARK_TYPE.PRIVATE };
      console.log('nav to bookmark');
      this.router.navigate(['/bookmarks']);
      /*
      this.bookmarkService.loadBookmarkList(id).subscribe(() => {
        console.log('nav to bookmark');
        this.router.navigate(['/bookmarks']);
      });*/
    }
  }

  loadPublicBookmarkList(id: string) {
    if (id && id.length > 0) {
      this.storageService.saveActiveBookmarkId({
        id,
        type: BOOKMARK_TYPE.PUBLIC,
      });

      this.currentBookmark = { id, type: BOOKMARK_TYPE.PUBLIC };

      this.bookmarkService.loadPublicBookmarkList(id, true).subscribe(() => {
        this.router.navigate(['/bookmarks']);
      });
    }
  }

  clearActiveBookmarkId() {
    this.bookmarkService.clearCurrentBookmarklist();
  }

  openCookieConsent() {
    if (this.ccService) {
      this.ccService.open();
    }
  }

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
    if (this.cookieService.get('GAEnabled') === 'true') {
      this.analytics.setAnalyticsCollectionEnabled(true);
      this.analytics.logEvent('enable_analytics');
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
      route = `/localtraders/${city.coordinates[0]}/${city.coordinates[1]}/${city.radius ? city.radius.toString() : '10'}`;
    }
    this.router.navigate([route]);
  }
}
