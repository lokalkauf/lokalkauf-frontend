import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { parseLazyRoute } from '@angular/compiler/src/aot/lazy_routes';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { Observable, of, Subscription } from 'rxjs';
import { BookmarkList } from 'src/app/models/bookmarkList';

@Component({
  selector: 'app-bookmarks-private-import',
  templateUrl: './bookmarks-private-import.component.html',
  styleUrls: ['./bookmarks-private-import.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookmarksPrivateImportComponent implements OnDestroy {
  isError: Observable<boolean>;
  merklistenid: string;

  bookmarkSubscripion$: Subscription;

  constructor(
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly bookmarksService: BookmarksService
  ) {
    this.isError = of(false);
    const bookmark$ = this.activeRoute.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        this.merklistenid = id;
        if (id) {
          return this.bookmarksService.loadBookmarkList(id);
        }
      })
    );

    this.bookmarkSubscripion$ = bookmark$
      .pipe(
        map((bookmark) => {
          if (bookmark) {
            console.log('bookmark-', bookmark);
            if (this.bookmarksService.importToLocalStorage(bookmark)) {
              this.router.navigate(['/bookmarks'], { replaceUrl: true });
            }
          } else {
            this.isError = of(true);
          }
        })
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this.bookmarkSubscripion$.unsubscribe();
  }
}