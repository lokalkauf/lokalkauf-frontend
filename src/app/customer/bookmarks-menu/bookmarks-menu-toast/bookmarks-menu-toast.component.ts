import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bookmarks-menu-toast',
  templateUrl: './bookmarks-menu-toast.component.html',
  styleUrls: ['./bookmarks-menu-toast.component.scss'],
})
export class BookmarksMenuToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
