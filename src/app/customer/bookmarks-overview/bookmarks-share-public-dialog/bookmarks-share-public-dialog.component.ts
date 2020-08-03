import { ViewEncapsulation, Component, Inject } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-bookmarks-share-public-dialog',
  templateUrl: './bookmarks-share-public-dialog.component.html',
  styleUrls: ['./bookmarks-share-public-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookmarksSharePublicDialogComponent {
  isShared$: Observable<boolean> = of(false);

  constructor(
    private readonly bookmarksService: BookmarksService,
    public dialogRef: MatDialogRef<BookmarksSharePublicDialogComponent>
  ) {
    const currentbookmarkPresent =
      this.bookmarksService.currentBookmarklist &&
      this.bookmarksService.currentBookmarklist.getValue();
    if (currentbookmarkPresent) {
      this.isShared$ = of(
        this.bookmarksService.currentBookmarklist.getValue().publicid
          ? true
          : false
      );
    }
  }

  shareNow() {}

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
    this.dialogRef.close();
  }
}
