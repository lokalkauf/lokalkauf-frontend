import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { BookmarksService, BOOKMARK_TYPE } from 'src/app/services/bookmarks.service';
import { TraderService } from 'src/app/services/trader.service';
import { Bookmark } from 'src/app/models/bookmark';
import { Observable, from, of, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { TraderProfileStatus, TraderProfile } from 'src/app/models/traderProfile';
import { LkMapComponent } from 'src/app/reusables/lk-map/lk-map.component';
import { ImageService } from 'src/app/services/image.service';
import { NavigationService, Coords } from 'src/app/services/navigation.service';
import { StorageService } from 'src/app/services/storage.service';
import { BookmarkList } from 'src/app/models/bookmarkList';
import { MatDialog } from '@angular/material/dialog';
import { BookmarksSharePrivateDialogComponent } from './bookmarks-share-private-dialog/bookmarks-share-private-dialog.component';
import { BookmarksSharePublicDialogComponent } from './bookmarks-share-public-dialog/bookmarks-share-public-dialog.component';
import { MatSelectionList } from '@angular/material/list';

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
  traderProfiles$: BehaviorSubject<TraderProfilesPlus[]> = new BehaviorSubject<TraderProfilesPlus[]>(null);
  hasProfilesInBookmark$: Observable<number> = of(0);
  showNavigationAttribution$ = of(false);

  tradersCounterSubscription: Subscription;
  loaderSubscription: Subscription;
  bookmarkList$: Observable<BookmarkList>;

  isPublicBookmark: boolean;

  @ViewChild(LkMapComponent) map: LkMapComponent;
  @ViewChild('lst') private bookmarkUiList: MatSelectionList;

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
      this.map.clearAllMarkers();

      profiles.forEach((profile) => {
        this.imageService.getThumbnailUrl(profile.defaultImagePath).then((x) => (profile.thumbUrl = x));
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
    console.log('dest');
    if (this.tradersCounterSubscription) {
      this.tradersCounterSubscription.unsubscribe();
    }
    if (this.loaderSubscription) {
      console.log('destroy sub');
      this.loaderSubscription.unsubscribe();
    }
  }

  clickCallback(mid: string) {
    if (mid) {
      const res = this.traderProfiles$.value.find((x) => x.mapid === mid);
      if (res) {
        const opt = this.bookmarkUiList.options.find((x) => x.value === res.id);
        if (opt) {
          this.bookmarkUiList.selectedOptions.select(opt);
          opt.focus();
        }
      }
    }
  }

  async resortList($event) {
    const fromIndex: number = $event.previousIndex;
    const toIndex: number = $event.currentIndex;
    if (fromIndex >= 0 && toIndex >= 0) {
      const traders = this.traderProfiles$.getValue();
      if (toIndex >= traders.length) {
        let k = toIndex - traders.length + 1;
        while (k--) {
          traders.push(undefined);
        }
      }
      traders.splice(toIndex, 0, traders.splice(fromIndex, 1)[0]);
      this.save();
    }
  }

  listSelectionChange($event) {
    const id: string = $event.option.value as string;
    if (!id) {
      return;
    }

    const elem = this.traderProfiles$.value.find((x) => x.id === id);
    if (elem) {
      this.map.setCenter(elem.confirmedLocation);
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
          const coords = profiles.map((trader) => this.swap(trader.confirmedLocation));
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
          const coords = profiles.map((trader) => this.swap(trader.confirmedLocation));
          const cachedData = this.storageService.loadCache(this.navigationService.getCacheKey(coords));
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
    const val = this.traderProfiles$.value;
    const coords = val.map((trader) => this.swap(trader.confirmedLocation));
    return {
      traders: val.map((x) => ({ traderid: x.id })),
      geo: this.storageService.loadCache(this.navigationService.getCacheKey(coords)),
    };
  }

  async save() {
    const data = this.gatherDataForSave();
    const bookmarklist: BookmarkList = {
      bookmarks: data.traders as Bookmark[],
      geojson: data.geo ? btoa(JSON.stringify(data.geo)) : null,
      name: this.bookmarksService.currentBookmarklist.getValue().name,
      creationdate: new Date().toLocaleString(),
    };

    if (this.storageService.loadActiveBookmarkId()) {
      bookmarklist.id = this.storageService.loadActiveBookmarkId().id;
    }
    const result = await this.bookmarksService.updateBookmarkList(bookmarklist);

    if (result) {
      console.log('save bookmark', result);
    }
  }

  load() {
    if (!this.storageService.loadActiveBookmarkId()) {
      return;
    }
    const currentBookmark = this.storageService.loadActiveBookmarkId();

    this.loaderSubscription = this.bookmarksService.loadActiveBookmarkList(currentBookmark).subscribe((bklist: BookmarkList) => {
      if (!bklist || !bklist.bookmarks) {
        return;
      }

      const bookmarkArray = bklist.bookmarks.map((traderlist) => traderlist.traderid);
      console.log('bookmarkArray', bookmarkArray);
      this.isPublicBookmark = currentBookmark.type !== BOOKMARK_TYPE.PRIVATE;

      if (bookmarkArray) {
        from(this.traderService.getTraderProfiles(bookmarkArray, TraderProfileStatus.PUBLIC)).subscribe((x) => {
          const tp: TraderProfilesPlus[] = [];
          bookmarkArray.forEach((y) => {
            const elem = x.find((z) => z.id === y);
            if (elem) {
              tp.push(elem);
            }
          });
          this.traderProfiles$.next(tp);
        });

        this.bookmarkList$ = of(bklist);
        this.hasProfilesInBookmark$ = of(bookmarkArray ? bookmarkArray.length : 0);
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
    this.tradersCounterSubscription = this.bookmarksService.bookmarkSubject.pipe(distinctUntilChanged()).subscribe((x) => {
      if (x) {
        console.log('FROM INIT - bookmark overview');
        this.load();
        if (this.bookmarkUiList) {
          this.bookmarkUiList.options.first.focus();
          this.bookmarkUiList.options.first.selected = true;
        }
      }
    });
  }

  private swap(input: number[]): number[] {
    return [input[1], input[0]];
  }
}
