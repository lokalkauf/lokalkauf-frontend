import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { Bookmark } from 'src/app/models/bookmark';

export interface BookmarkData {
  traderid?: string;
  name?: string;
}

@Component({
  selector: 'app-bookmarks-dialog',
  templateUrl: './bookmarks-dialog.component.html',
  styleUrls: ['./bookmarks-dialog.component.scss'],
})
export class BookmarksDialogComponent {
  bookmarkForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  constructor(
    private readonly storageService: StorageService,
    private readonly bookmarkService: BookmarksService,
    public dialogRef: MatDialogRef<BookmarksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookmarkData
  ) {}

  async onSubmit() {
    const bookmarkList = {
      bookmarks: [{ traderid: this.data.traderid } as Bookmark],
      geojson: null,
      name: this.bookmarkForm.get('name').value,
      description: this.bookmarkForm.get('description')
        ? this.bookmarkForm.get('description').value
        : undefined,
      creationdate: new Date().toLocaleString(),
    };
    console.log(bookmarkList);
    await this.bookmarkService.updateBookmarkList(bookmarkList);
    this.closeDialog();
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
