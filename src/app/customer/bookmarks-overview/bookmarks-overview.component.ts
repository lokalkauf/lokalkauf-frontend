import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { TraderService } from 'src/app/services/trader.service';
import { Bookmark } from 'src/app/models/bookmark';
import {
  Observable,
  from,
  of,
  BehaviorSubject,
  Subject,
  Subscription,
} from 'rxjs';
import { map, tap, distinctUntilChanged } from 'rxjs/operators';
import {
  TraderProfileStatus,
  TraderProfile,
} from 'src/app/models/traderProfile';
import { LkMapComponent } from 'src/app/reusables/lk-map/lk-map.component';
import { ImageService } from 'src/app/services/image.service';
import { MatStepper } from '@angular/material/stepper';
import { NavigationService, Coords } from 'src/app/services/navigation.service';
import { StorageService } from 'src/app/services/storage.service';
import { BookmarkList } from 'src/app/models/bookmarkList';
import {
  throwMatDialogContentAlreadyAttachedError,
  MatDialog,
} from '@angular/material/dialog';
import { BookmarksSharePrivateDialogComponent } from './bookmarks-share-private-dialog/bookmarks-share-private-dialog.component';
import { BookmarksSharePublicDialogComponent } from './bookmarks-share-public-dialog/bookmarks-share-public-dialog.component';

export interface TraderProfilesPlus extends TraderProfile {
  thumbUrl?: string;
  mapid?: string;
}

@Component({
  selector: 'app-bookmarks-overview',
  templateUrl: './bookmarks-overview.component.html',
  styleUrls: ['./bookmarks-overview.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookmarksOverviewComponent implements OnInit, OnDestroy {
  bookmarks: Observable<Bookmark[]>;
  traderProfiles$: BehaviorSubject<TraderProfilesPlus[]> = new BehaviorSubject<
    TraderProfilesPlus[]
  >(null);
  hasProfilesInBookmark$: Observable<number> = of(0);
  showNavigationAttribution$ = of(false);

  tradersCounterSubscription: Subscription;
  loaderSubscription: Subscription;

  @ViewChild(LkMapComponent) map: LkMapComponent;
  @ViewChild('stepper') private bookmarkStepperList: MatStepper;

  constructor(
    readonly bookmarksService: BookmarksService,
    private readonly traderService: TraderService,
    private readonly imageService: ImageService,
    private readonly storageService: StorageService,
    private readonly navigationService: NavigationService,
    public dialog: MatDialog
  ) {
    this.showNavigationAttribution$ = of(false);

    this.load();

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
    });
  }
  ngOnDestroy(): void {
    if (this.tradersCounterSubscription) {
      this.tradersCounterSubscription.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }

  clickCallback(mid: string) {
    this.traderProfiles$
      .pipe(
        map((profiles) =>
          profiles.findIndex((profile) => profile.mapid === mid)
        )
      )
      .subscribe((index) => {
        this.bookmarkStepperList.selectedIndex = index;
      });
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

  stepperChange($event) {
    if ($event) {
      const index = $event.selectedIndex;

      this.traderProfiles$
        .pipe(
          map((profiles) => {
            const coords = profiles[index].confirmedLocation;
            this.map.setCenter(coords);
          })
        )
        .subscribe();

      setTimeout(() => {
        document
          .getElementById(this.bookmarkStepperList._getStepLabelId(index))
          .scrollIntoView(true);
      });
    }
  }

  deleteBookmark() {
    this.bookmarksService.deleteBookmark();
    this.hasProfilesInBookmark$ = of(0);
  }

  navigate() {
    this.traderProfiles$
      .pipe(
        map((profiles) => {
          const coords = profiles.map((trader) =>
            this.swap(trader.confirmedLocation)
          );
          this.map.clearRoute();
          this.navigationService.getNavigationPath(coords).subscribe((geo) => {
            this.map.displayGeoJsonOnMap(geo);
            this.showNavigationAttribution$ = of(true);
          });
        })
      )
      .subscribe();
  }

  displayRouteFromCache() {
    this.traderProfiles$
      .pipe(
        map((profiles) => {
          const coords = profiles.map((trader) =>
            this.swap(trader.confirmedLocation)
          );
          const cachedData = this.storageService.loadCache(
            this.navigationService.getCacheKey(coords)
          );
          this.map.clearRoute();
          if (cachedData) {
            this.map.displayGeoJsonOnMap(cachedData);
            this.showNavigationAttribution$ = of(true);
          }
        })
      )
      .subscribe();
  }

  private gatherDataForSave() {
    return this.traderProfiles$.pipe(
      map((profiles) => {
        const coords = profiles.map((trader) =>
          this.swap(trader.confirmedLocation)
        );

        return {
          traders: profiles.map((x) => ({ traderid: x.id })),
          geo: this.storageService.loadCache(
            this.navigationService.getCacheKey(coords)
          ),
        };
      })
    );
  }

  async save() {
    this.gatherDataForSave().subscribe(async (data) => {
      const bookmarklist: BookmarkList = {
        bookmarks: data.traders as Bookmark[],
        geojson: data.geo ? btoa(JSON.stringify(data.geo)) : null,
        name: this.bookmarksService.currentBookmarklist.getValue().name,
        creationdate: new Date().toLocaleString(),
      };

      if (this.storageService.loadActiveBookmarkId()) {
        bookmarklist.id = this.storageService.loadActiveBookmarkId();
      }
      const result = await this.bookmarksService.updateBookmarkList(
        bookmarklist
      );

      if (result) {
        console.log(result);
      }
    });
  }

  load() {
    if (!this.storageService.loadActiveBookmarkId()) {
      return;
    }

    this.loaderSubscription = this.bookmarksService
      .loadBookmarkList(this.storageService.loadActiveBookmarkId())
      .subscribe((bklist: BookmarkList) => {
        if (!bklist || !bklist.bookmarks) {
          return;
        }
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

          this.hasProfilesInBookmark$ = of(
            bookmarkArray ? bookmarkArray.length : 0
          );
          this.map.clearRoute();
          if (bklist.geojson) {
            this.map.displayGeoJsonOnMap(JSON.parse(atob(bklist.geojson)));
            this.showNavigationAttribution$ = of(true);
          }
        }
      });
  }

  openSharePrivateDialog() {
    this.dialog.open(BookmarksSharePrivateDialogComponent, {
      disableClose: true,
    });
  }

  openSharePublicDialog() {
    this.dialog.open(BookmarksSharePublicDialogComponent, {
      disableClose: true,
    });
  }

  ngOnInit(): void {
    this.tradersCounterSubscription = this.bookmarksService.bookmarkSubject
      .pipe(distinctUntilChanged())
      .subscribe((x) => {
        if (x) {
          console.log('FROM INIT');
          this.load();
        }
      });
  }

  private swap(input: number[]): number[] {
    return [input[1], input[0]];
  }
}
