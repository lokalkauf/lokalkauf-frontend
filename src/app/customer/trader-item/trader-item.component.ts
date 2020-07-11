import { Component, Input, OnInit } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { Trader } from 'src/app/models/trader';
import { Bookmark } from 'src/app/models/bookmark';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-trader-item',
  templateUrl: './trader-item.component.html',
  styleUrls: ['./trader-item.component.scss'],
})
export class TraderItemComponent implements OnInit {
  @Input() trader: any;
  isTraderInBookmarks$: Observable<boolean>;

  constructor(private readonly bookmarkService: BookmarksService) {}
  ngOnInit(): void {
    this.isTraderInBookmarks$ = of(
      this.bookmarkService.isTraderInBookmarks(this.trader.id)
    );
  }

  removeBookmark(id: string) {
    this.bookmarkService.removeTrader({ traderid: id } as Bookmark);
    this.isTraderInBookmarks$ = of(
      this.bookmarkService.isTraderInBookmarks(this.trader.id)
    );
  }

  removeBookmarkSmall($event: Event, id: string) {
    this.removeBookmark(id);
    $event.preventDefault();
    $event.stopImmediatePropagation();
  }

  addBookmark(id: string) {
    this.bookmarkService.addTrader({ traderid: id } as Bookmark);
    this.isTraderInBookmarks$ = of(
      this.bookmarkService.isTraderInBookmarks(this.trader.id)
    );
  }

  addBookmarkSmall($event: Event, id: string) {
    this.addBookmark(id);
    $event.preventDefault();
    $event.stopImmediatePropagation();
  }
}
