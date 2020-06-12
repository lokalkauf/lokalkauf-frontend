import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable, of, Subject } from 'rxjs';
import { Bookmark } from '../models/bookmark';

@Injectable()
export class BookmarksService {
  private bookmarkSubject: Subject<number> = new Subject<number>();

  constructor(private readonly storageService: StorageService) {
    if (this.getBookmarks()) {
      setTimeout(() => {
        this.bookmarkSubject.next(this.getBookmarks().length);
      }, 1000);
    }
  }

  getBookmarks(): Bookmark[] {
    const loaded = this.storageService.loadBookmarks();
    return loaded ? loaded : [];
  }

  getBookmarksAsync(): Observable<Bookmark[]> {
    const loaded = this.storageService.loadBookmarks();
    return loaded ? of(loaded) : of([]);
  }

  addTrader(bookmark: Bookmark): Bookmark[] {
    const allBookmarks = this.getBookmarks();
    if (!allBookmarks) {
      const bookmarks: Bookmark[] = new Array();
      bookmarks.push(bookmark);
      this.storageService.saveBookmarks(bookmarks);
      this.updateBookmarksCount();
      return bookmarks;
    }

    if (
      allBookmarks.filter((x) => x.traderid === bookmark.traderid).length === 0
    ) {
      allBookmarks.push(bookmark);
      this.storageService.saveBookmarks(allBookmarks);
    }
    this.updateBookmarksCount();
    return allBookmarks;
  }

  removeTrader(bookmark: Bookmark): Bookmark[] {
    const allBookmarks = this.getBookmarks();
    if (
      allBookmarks.filter((x) => x.traderid === bookmark.traderid).length > 0
    ) {
      this.storageService.saveBookmarks(
        allBookmarks.filter((x) => x.traderid !== bookmark.traderid)
      );
    }
    this.updateBookmarksCount();
    return allBookmarks;
  }

  deleteBookmarks() {
    this.storageService.saveBookmarks([]);
    this.updateBookmarksCount();
  }

  isTraderInBookmarks(traderid: string): boolean {
    const allBookmarks = this.getBookmarks();

    return allBookmarks &&
      allBookmarks.filter((x) => x.traderid === traderid).length > 0
      ? true
      : false;
  }

  private updateBookmarksCount(): void {
    this.bookmarkSubject.next(this.getBookmarks().length);
  }

  public getBookmarkCount(): Observable<number> {
    return this.bookmarkSubject;
  }
}
