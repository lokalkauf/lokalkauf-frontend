import { ViewEncapsulation, Component, Inject } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bookmarks-share-private-dialog',
  templateUrl: './bookmarks-share-private-dialog.component.html',
  styleUrls: ['./bookmarks-share-private-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookmarksSharePrivateDialogComponent {
  constructor(
    private readonly bookmarksService: BookmarksService,
    public dialogRef: MatDialogRef<BookmarksSharePrivateDialogComponent>
  ) {}

  public getCurrentPrivateUrl() {
    const domain = window.location.host;
    const currentbookmarkPresent =
      this.bookmarksService.currentBookmarklist &&
      this.bookmarksService.currentBookmarklist.getValue();
    if (domain && currentbookmarkPresent) {
      return (
        'https://' +
        domain +
        '/bookmarks-pi/' +
        this.bookmarksService.currentBookmarklist.getValue().id
      );
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
