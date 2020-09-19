import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Observable, of } from 'rxjs';
import { Bookmark } from 'src/app/models/bookmark';
import {
  ActiveBookmark,
  BookmarksService,
  BOOKMARK_TYPE,
  LocalBookmark,
} from 'src/app/services/bookmarks.service';
import { StorageService } from 'src/app/services/storage.service';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-bookmarks-menu',
  templateUrl: './bookmarks-menu.component.html',
  styleUrls: ['./bookmarks-menu.component.scss'],
})
export class BookmarksMenuComponent {
  localBookmarks: Observable<LocalBookmark[]>;
  currentBookmark: ActiveBookmark;

  @ViewChild('bookmarkMenuTrader') matMenu: MatMenu;

  @Input() traderId: string;

  constructor(
    private storageService: StorageService,
    private bookmarkService: BookmarksService,
    public dialog: MatDialog
  ) {
    this.bookmarkService.currentBookmarklist.subscribe((x) => {
      this.currentBookmark = this.storageService.loadActiveBookmarkId();
      this.localBookmarks = of(this.bookmarkService.getLocalBookmarkLists());
    });
  }

  loadBookmarkList(id: string) {
    if (id && id.length > 0) {
      this.storageService.saveActiveBookmarkId({
        id,
        type: BOOKMARK_TYPE.PRIVATE,
      });
      this.bookmarkService.loadBookmarkList(id).subscribe();
      this.currentBookmark = { id, type: BOOKMARK_TYPE.PRIVATE };
    }
  }

  addToBookmarklist(bookmarkid: string) {
    const currentBookmark = this.storageService.loadActiveBookmarkId();
    if (
      !currentBookmark ||
      (!currentBookmark.id && currentBookmark.type === BOOKMARK_TYPE.UNKNOWN)
    ) {
      return;
    } else {
      this.bookmarkService.addTraderToBookmark(bookmarkid, {
        traderid: this.traderId,
      } as Bookmark);
    }
  }

  clearActiveBookmarkId() {
    this.bookmarkService.clearCurrentBookmarklist();
  }
}
