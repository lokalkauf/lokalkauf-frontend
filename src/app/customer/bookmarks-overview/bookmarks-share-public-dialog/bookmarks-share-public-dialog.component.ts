import { ViewEncapsulation, Component, Inject, OnInit } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, of, Subscription } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-bookmarks-share-public-dialog',
  templateUrl: './bookmarks-share-public-dialog.component.html',
  styleUrls: ['./bookmarks-share-public-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookmarksSharePublicDialogComponent implements OnInit {
  isShared$: Observable<boolean>;

  currentBookmarkSubscription: Subscription;

  constructor(
    private readonly bookmarksService: BookmarksService,
    private clipboard: Clipboard,
    public dialogRef: MatDialogRef<BookmarksSharePublicDialogComponent>
  ) {
    this.isShared$ = of(false);
  }
  ngOnInit(): void {
    this.currentBookmarkSubscription = this.bookmarksService.currentBookmarklist.subscribe(
      (bkm) => {
        this.isShared$ = of(
          bkm.publicid !== undefined &&
            bkm.publicid.length > 0 &&
            bkm.publicactive !== undefined &&
            bkm.publicactive === true
        );
      }
    );
  }

  copyToClipboard() {
    this.clipboard.copy(this.getCurrentPublicUrl());
  }

  async shareNow() {
    await this.bookmarksService.publishLocalBookmarkList();
  }

  unshare() {
    this.bookmarksService.unpublishLocalBookmarkList();
  }

  public getCurrentPublicUrl() {
    const domain = window.location.host;
    const currentbookmarkPresent =
      this.bookmarksService.currentBookmarklist &&
      this.bookmarksService.currentBookmarklist.getValue();
    if (domain && currentbookmarkPresent) {
      return (
        'https://' +
        domain +
        '/bookmarks-public/' +
        this.bookmarksService.currentBookmarklist.getValue().publicid
      );
    }
  }

  closeDialog() {
    if (this.currentBookmarkSubscription) {
      this.currentBookmarkSubscription.unsubscribe();
    }
    this.dialogRef.close();
  }
}
