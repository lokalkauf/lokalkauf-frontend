import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { TraderService } from 'src/app/services/trader.service';
import { Bookmark } from 'src/app/models/bookmark';
import { Observable, from, Subject, of } from 'rxjs';
import { map, tap, distinctUntilChanged } from 'rxjs/operators';
import {
  TraderProfileStatus,
  TraderProfile,
} from 'src/app/models/traderProfile';
import { LkMapComponent } from 'src/app/reusables/lk-map/lk-map.component';
import { ImageService } from 'src/app/services/image.service';
import { MatStepper } from '@angular/material/stepper';

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
export class BookmarksOverviewComponent implements OnInit {
  bookmarks: Observable<Bookmark[]>;
  traderProfiles$: Observable<TraderProfilesPlus[]>;
  hasProfilesInBookmark$: Observable<number> = of(0);

  @ViewChild(LkMapComponent) map: LkMapComponent;
  @ViewChild('stepper') private bookmarkStepperList: MatStepper;

  constructor(
    readonly bookmarksService: BookmarksService,
    private readonly traderService: TraderService,
    private readonly imageService: ImageService
  ) {
    bookmarksService
      .getBookmarksAsync()
      .pipe(
        map((bookmarks) => {
          if (bookmarks) {
            return bookmarks.map((bookmark) => bookmark.traderid);
          }
        }),
        tap((bookmarkArray) => {
          if (bookmarkArray) {
            this.traderProfiles$ = from(
              this.traderService.getTraderProfiles(
                bookmarkArray,
                TraderProfileStatus.PUBLIC
              )
            );
          }
          this.hasProfilesInBookmark$ = of(
            bookmarkArray ? bookmarkArray.length : 0
          );
        })
      )
      .subscribe();

    this.traderProfiles$.subscribe((profiles) => {
      profiles.sort(this.sortProfiles());

      profiles.forEach((profile) => {
        this.imageService
          .getThumbnailUrl(profile.defaultImagePath)
          .then((x) => (profile.thumbUrl = x));
        const id = this.map.addMarker(profile.confirmedLocation, true);
        if (id) {
          profile.id = id;
        }
      });
      if (profiles.length > 0) {
        this.map.setCenter(profiles[0].confirmedLocation);
      }
    });
  }

  clickCallback(id: string) {
    this.traderProfiles$
      .pipe(
        map((profiles) => profiles.findIndex((profile) => profile.id === id))
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

  deleteBookmarks() {
    this.bookmarksService.deleteBookmarks();
    this.hasProfilesInBookmark$ = of(0);
  }

  ngOnInit(): void {}
}