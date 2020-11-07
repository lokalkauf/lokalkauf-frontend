import { ViewEncapsulation, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { BookmarksYesNoDialogComponent } from '../bookmarks-yes-no-dialog/bookmarks-yes-no-dialog.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-bookmarks-share-public-dialog',
  templateUrl: './bookmarks-share-public-dialog.component.html',
  styleUrls: ['./bookmarks-share-public-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookmarksSharePublicDialogComponent implements OnInit {
  @ViewChild('sharetoggle')
  shareToggle: MatSlideToggle;

  isShared$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentBookmarkSubscription: Subscription;

  constructor(private readonly bookmarksService: BookmarksService, private clipboard: Clipboard, public dialog: MatDialog, public dialogRef: MatDialogRef<BookmarksSharePublicDialogComponent>) {
    this.isShared$.next(false);
  }
  ngOnInit(): void {
    this.currentBookmarkSubscription = this.bookmarksService.currentBookmarklist.subscribe((bkm) => {
      this.isShared$.next(bkm.publicid !== undefined && bkm.publicid.length > 0 && bkm.publicactive !== undefined && bkm.publicactive === true);
    });
  }

  copyToClipboard() {
    this.clipboard.copy(this.getCurrentPublicUrl());
  }

  async shareNow() {
    await this.bookmarksService.publishLocalBookmarkList();
  }

  unshare() {
    this.dialog
      .open(BookmarksYesNoDialogComponent, { data: { question: 'Liste nicht mehr öffentlich zugänglich machen?' } })
      .afterClosed()
      .subscribe((x) => {
        if (x === true) {
          this.bookmarksService.unpublishLocalBookmarkList();
        } else {
          this.shareToggle.toggle();
        }
      });
  }

  public getCurrentPublicUrl() {
    const domain = window.location.host;
    const currentbookmarkPresent = this.bookmarksService.currentBookmarklist && this.bookmarksService.currentBookmarklist.getValue();
    if (domain && currentbookmarkPresent) {
      return 'https://' + domain + '/bookmarks-public/' + this.bookmarksService.currentBookmarklist.getValue().publicid;
    }
  }

  async shareChange(event$) {
    console.log(event$);
    if (event$) {
      const checked = event$.checked;
      if (checked) {
        await this.shareNow();
      } else {
        this.unshare();
      }
    }
  }

  closeDialog() {
    if (this.currentBookmarkSubscription) {
      this.currentBookmarkSubscription.unsubscribe();
    }
    this.dialogRef.close();
  }
}
