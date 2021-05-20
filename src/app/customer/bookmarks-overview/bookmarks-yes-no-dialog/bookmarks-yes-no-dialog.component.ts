import { Inject } from '@angular/core';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface YesNoDataContainer {
  question: string;
}

@Component({
  selector: 'app-bookmarks-yes-no-dialog',
  templateUrl: './bookmarks-yes-no-dialog.component.html',
  styleUrls: ['./bookmarks-yes-no-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookmarksYesNoDialogComponent {
  constructor(public dialogRef: MatDialogRef<BookmarksYesNoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: YesNoDataContainer) {}

  closeDialog(result) {
    this.dialogRef.close(result);
  }
}
