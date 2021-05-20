import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { BookmarksService, BOOKMARK_TYPE } from 'src/app/services/bookmarks.service';
import { Trader } from 'src/app/models/trader';
import { Bookmark } from 'src/app/models/bookmark';
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, flatMap, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { BookmarksDialogComponent } from '../bookmarks-dialog/bookmarks-dialog.component';
import { StorageService } from 'src/app/services/storage.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-trader-item',
  templateUrl: './trader-item.component.html',
  styleUrls: ['./trader-item.component.scss'],
})
export class TraderItemComponent implements OnInit, OnDestroy {
  @Input() trader: any;
  isTraderInBookmarks$: Observable<boolean>;
  imageUrl$: Observable<string>;
  bookmarklistSubsciption: Subscription;

  constructor(private readonly bookmarkService: BookmarksService, private imageService: ImageService, private readonly storageService: StorageService, public dialog: MatDialog) {}

  ngOnDestroy(): void {
    if (this.bookmarklistSubsciption) {
      this.bookmarklistSubsciption.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.imageUrl$ = of(this.trader.defaultImagePath).pipe(flatMap((image) => (!image || image == null ? of('/assets/lokalkauf-pin.svg') : this.imageService.waitForThumbnailUrl(image, '224x224', 2000))));
    this.bookmarklistSubsciption = this.bookmarkService.currentBookmarklist
      .pipe(
        map((bookmark) => {
          if (bookmark) {
            this.isTraderInBookmarks$ = of(this.updateSelection(bookmark.bookmarks));
          } else {
            this.isTraderInBookmarks$ = of(false);
          }
        }),
        distinctUntilChanged()
      )
      .subscribe();
  }

  removeBookmark(id: string) {
    this.bookmarkService.removeTrader({ traderid: id } as Bookmark);
  }

  removeBookmarkSmall($event: Event, id: string) {
    this.bookmarkService.removeTrader({ traderid: id } as Bookmark);
    $event.preventDefault();
    $event.stopImmediatePropagation();
  }

  addBookmark(id: string) {
    const currentBookmark = this.storageService.loadActiveBookmarkId();
    if (!currentBookmark || (!currentBookmark.id && currentBookmark.type === BOOKMARK_TYPE.UNKNOWN)) {
      this.createBookmarksDialog(id);
    } else {
      this.bookmarkService.addTrader({ traderid: id } as Bookmark);
    }
  }

  preventDefault($event: Event) {
    $event.preventDefault();
    $event.stopImmediatePropagation();
  }

  addBookmarkSmall($event: Event, id: string) {
    const currentBookmark = this.storageService.loadActiveBookmarkId();
    if (!currentBookmark || (!currentBookmark.id && currentBookmark.type === BOOKMARK_TYPE.UNKNOWN)) {
      this.createBookmarksDialog(id);
    } else {
      this.bookmarkService.addTrader({ traderid: id } as Bookmark);
      $event.preventDefault();
      $event.stopImmediatePropagation();
    }
  }

  createBookmarksDialog(traderid) {
    if (!traderid) {
      return;
    }
    this.dialog.open(BookmarksDialogComponent, {
      disableClose: true,
      data: { traderid },
    });
  }

  updateSelection(bookmarks: Bookmark[]): boolean {
    const id = this.trader ? this.trader.id : undefined;
    if (id) {
      return bookmarks.filter((bookmark) => bookmark.traderid === id).length > 0;
    }
    return false;
  }
}
