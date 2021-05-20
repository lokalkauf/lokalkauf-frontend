import {
  Component,
  ViewEncapsulation,
  OnDestroy,
  ViewChild,
  OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { Observable, of, Subscription, from, BehaviorSubject } from 'rxjs';
import { TraderService } from 'src/app/services/trader.service';
import { ImageService } from 'src/app/services/image.service';
import { BookmarkListPublic } from 'src/app/models/bookmarkListPublic';
import { TraderProfileStatus } from 'src/app/models/traderProfile';
import { TraderProfilesPlus } from '../bookmarks-overview/bookmarks-overview.component';
import { LkMapComponent } from 'src/app/reusables/lk-map/lk-map.component';

@Component({
  selector: 'app-bookmarks-public-import',
  templateUrl: './bookmarks-public-import.component.html',
  styleUrls: ['./bookmarks-public-import.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookmarksPublicImportComponent implements OnDestroy {
  isError: Observable<boolean>;
  merklistenid: string;
  bookmarkListPublic$: Observable<BookmarkListPublic>;
  bookmarkSubscripion$: Subscription;

  traderProfiles$: BehaviorSubject<TraderProfilesPlus[]> = new BehaviorSubject<
    TraderProfilesPlus[]
  >(null);
  showNavigationAttribution$ = of(false);

  @ViewChild(LkMapComponent) map: LkMapComponent;

  constructor(
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly bookmarksService: BookmarksService,
    private readonly traderService: TraderService,
    private readonly imageService: ImageService
  ) {
    this.isError = of(false);
    const bookmark$ = this.activeRoute.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        this.merklistenid = id;
        if (id) {
          return this.bookmarksService.loadPublicBookmarkList(id);
        }
      })
    );

    this.traderProfiles$.subscribe((profiles) => {
      if (!profiles) {
        return;
      }

      profiles.sort(this.sortProfiles());

      this.map.clearAllMarkers();

      profiles.forEach((profile) => {
        this.imageService
          .getThumbnailUrl(profile.defaultImagePath)
          .then((x) => (profile.thumbUrl = x));
        const mid = this.map.addMarker(profile.confirmedLocation, true);
        if (mid) {
          profile.mapid = mid;
        }
      });
      if (profiles.length > 0) {
        this.map.setCenter(profiles[0].confirmedLocation);
      }
      this.map.clearRoute();

      this.bookmarkListPublic$
        .pipe(
          map((x) => {
            if (x.geojson) {
              this.map.displayGeoJsonOnMap(JSON.parse(atob(x.geojson)));
              this.showNavigationAttribution$ = of(true);
            }
          })
        )
        .subscribe();
    });

    this.bookmarkSubscripion$ = bookmark$.subscribe((bklist) => {
      if (bklist) {
        this.bookmarkListPublic$ = of(bklist);
        const bookmarkArray = bklist.bookmarks.map(
          (traderlist) => traderlist.traderid
        );
        if (bookmarkArray) {
          from(
            this.traderService.getTraderProfiles(
              bookmarkArray,
              TraderProfileStatus.PUBLIC
            )
          ).subscribe((x) => this.traderProfiles$.next(x));
        }
      } else {
        this.isError = of(true);
      }
    });
  }

  save() {
    if (this.bookmarkListPublic$) {
      const sub = this.bookmarkListPublic$
        .pipe(
          map((bookmark) => {
            this.bookmarksService.importPublicBookmarklist(bookmark);
          })
        )
        .subscribe();
      if (sub) {
        sub.unsubscribe();
      }
    }
  }

  ngOnDestroy(): void {
    this.bookmarkSubscripion$.unsubscribe();
  }

  private sortProfiles(): (
    a: TraderProfilesPlus,
    b: TraderProfilesPlus
  ) => number {
    return (x, y) => {
      if (x.city > y.city) {
        return -1;
      }
      if (y.city > x.city) {
        return 1;
      }
      return 0;
    };
  }
}
