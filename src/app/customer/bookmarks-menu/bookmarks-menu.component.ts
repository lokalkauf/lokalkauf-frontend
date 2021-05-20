import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bookmark } from 'src/app/models/bookmark';
import { ActiveBookmark, BookmarksService, BOOKMARK_TYPE, LocalBookmark } from 'src/app/services/bookmarks.service';
import { StorageService } from 'src/app/services/storage.service';
import { BookmarksDialogComponent } from '../bookmarks-dialog/bookmarks-dialog.component';
import { BookmarksMenuToastComponent } from './bookmarks-menu-toast/bookmarks-menu-toast.component';

@Component({
  selector: 'app-bookmarks-menu',
  templateUrl: './bookmarks-menu.component.html',
  styleUrls: ['./bookmarks-menu.component.scss'],
})
export class BookmarksMenuComponent {
  localBookmarks: Observable<LocalBookmark[]>;
  currentBookmark: ActiveBookmark;

  isTraderCurrentList$: Observable<boolean>;

  @ViewChild('bookmarkMenuTrader') matMenu: MatMenu;

  @Input() traderId: string;

  @Input() matMini = false;

  constructor(private storageService: StorageService, private bookmarkService: BookmarksService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.bookmarkService.currentBookmarklist.subscribe((x) => {
      this.currentBookmark = this.storageService.loadActiveBookmarkId();
      this.localBookmarks = of(this.bookmarkService.getLocalBookmarkLists());
    });
  }

  amISelected(): Observable<boolean> {
    if (!this.currentBookmark || !this.currentBookmark.id || !this.bookmarkService.currentBookmarklist.getValue()) {
      return of(false);
    }

    return of(this.bookmarkService.currentBookmarklist.getValue().bookmarks.find((x) => x.traderid === this.traderId) !== undefined);
  }

  amISelectedInCurrentList(bookmarkid: string): Observable<boolean> {
    if (!this.bookmarkService.currentBookmarklist.getValue()) {
      return of(false);
    }
    return this.bookmarkService.currentBookmarklist.pipe(
      map((y) => {
        return this.currentBookmark && this.currentBookmark.id === bookmarkid && y && y.bookmarks.filter((x) => x.traderid === this.traderId).length > 0;
      })
    );
  }

  addToBookmarklist(bookmarkid: string) {
    const currentBookmark = this.storageService.loadActiveBookmarkId();
    if (!currentBookmark || (!currentBookmark.id && currentBookmark.type === BOOKMARK_TYPE.UNKNOWN)) {
      return;
    } else {
      this.bookmarkService
        .addTraderToBookmark(bookmarkid, {
          traderid: this.traderId,
        } as Bookmark)
        .then((x) => {
          const name = this.bookmarkService.getBookmarknameById(bookmarkid);
          const message = `Erfolgreich zur Merkliste '${name}' zugefügt`;
          this.snackBar.openFromComponent(BookmarksMenuToastComponent, { data: { name, isAdd: true }, duration: 3000, panelClass: ['toastmessage-merkliste-added'] });
        });
    }
  }

  removeFromBookmarklist() {
    const currentBookmark = this.storageService.loadActiveBookmarkId();
    if (!currentBookmark || (!currentBookmark.id && currentBookmark.type === BOOKMARK_TYPE.UNKNOWN)) {
      return;
    } else {
      this.bookmarkService.removeTrader({
        traderid: this.traderId,
      } as Bookmark);
      const name = this.bookmarkService.getBookmarknameById(currentBookmark.id);
      this.snackBar.openFromComponent(BookmarksMenuToastComponent, { data: { name, isAdd: false }, duration: 3000, panelClass: ['toastmessage-merkliste-removed'] });
    }
  }

  addNewBookmark() {
    // TODO: remove maybe
    this.bookmarkService.clearCurrentBookmarklist();

    this.dialog.open(BookmarksDialogComponent, {
      disableClose: true,
      data: { traderid: this.traderId },
    });
  }
}