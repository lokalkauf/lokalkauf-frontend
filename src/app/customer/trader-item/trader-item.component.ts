import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { Trader } from 'src/app/models/trader';
import { Bookmark } from 'src/app/models/bookmark';
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatDialog } from '@angular/material/dialog';
import { BookmarksDialogComponent } from '../bookmarks-dialog/bookmarks-dialog.component';
import { Identifiers } from '@angular/compiler';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-trader-item',
  templateUrl: './trader-item.component.html',
  styleUrls: ['./trader-item.component.scss'],
})
export class TraderItemComponent implements OnInit {
  @Input() trader: any;
  isTraderInBookmarks$: Observable<boolean>;

  constructor(
    private readonly bookmarkService: BookmarksService,
    private readonly storageService: StorageService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.bookmarkService.currentBookmarklist
      .pipe(
        map((x) => {
          if (x) {
            this.isTraderInBookmarks$ = of(this.updateSelection(x.bookmarks));
          }
        })
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
    if (!this.storageService.loadActiveBookmarkId()) {
      this.createBookmarksDialog(id);
    } else {
      this.bookmarkService.addTrader({ traderid: id } as Bookmark);
    }
  }

  addBookmarkSmall($event: Event, id: string) {
    if (!this.storageService.loadActiveBookmarkId()) {
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
      return (
        bookmarks.filter((bookmark) => bookmark.traderid === id).length > 0
      );
    }
    return false;
  }
}
