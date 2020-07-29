import { Injectable } from '@angular/core';
import { GeoAddress } from '../models/geoAddress';
import { LkSelectOptions } from '../reusables/lk-select/lk-select.component';
import { Bookmark } from '../models/bookmark';
import { LocalBookmark } from './bookmarks.service';

@Injectable()
export class StorageService {
  saveUserPosition(location: number[], toLocalStorage?: boolean) {
    this.save('user-position', location, toLocalStorage);
  }

  loadUserPosition(fromLocalStorage?: boolean): number[] {
    return this.load('user-position', fromLocalStorage);
  }

  saveLocation(location: GeoAddress, toLocalStorage?: boolean) {
    this.save('city', location, toLocalStorage);
  }

  loadLocation(fromLocalStorage?: boolean): GeoAddress {
    return this.load('city', fromLocalStorage);
  }

  saveTraderFilter(filter: LkSelectOptions) {
    this.save('trader-filter', filter);
  }

  loadTraderFilter(): LkSelectOptions {
    return this.load('trader-filter');
  }

  saveBookmarks(bookmarks: Bookmark[]) {
    this.save('bookmarks', bookmarks);
  }

  loadBookmarks(): Bookmark[] {
    return this.load('bookmarks');
  }

  saveActiveBookmarkId(id: string) {
    this.save('active-bookmark-id', id, true);
  }

  loadActiveBookmarkId(): string | undefined {
    return this.load('active-bookmark-id', true);
  }

  savePrivateBookmark(localBookmark: LocalBookmark) {
    if (!localBookmark || localBookmark.id.length === 0) {
      return;
    }
    const privateBookmarks = this.loadPrivateBookmarks();
    if (
      !privateBookmarks ||
      privateBookmarks.filter((local) => local.id === localBookmark.id)
        .length === 0
    ) {
      privateBookmarks.push(localBookmark);
      this.save('private-bookmarks', privateBookmarks, true);
    }
  }
  removePrivateBookmark(bookmarkid: string) {
    const bookmarks = this.loadPrivateBookmarks();
    if (bookmarks) {
      const privateBookmarks = bookmarks.filter(
        (bookmark) => bookmark.id !== bookmarkid
      );
      this.save('private-bookmarks', privateBookmarks, true);
    }
  }

  loadPrivateBookmarks(): LocalBookmark[] {
    const result = this.load<LocalBookmark[]>('private-bookmarks', true);
    return !result ? [] : result;
  }

  saveTextsearch(searchString: string) {
    this.save('search-text', searchString);
  }

  loadTextsearch(): string {
    return this.load('search-text');
  }

  saveCache(key: string, value: string) {
    this.save(key, value);
  }

  loadCache(key: string) {
    return this.load(key);
  }

  private save<T>(key: string, item: T, toLocalStorage?: boolean) {
    const jsonItem = JSON.stringify(item);

    if (toLocalStorage === true) {
      localStorage.setItem(key, jsonItem);
    } else {
      sessionStorage.setItem(key, jsonItem);
    }
  }

  private loadSimple(key: string, fromLocalStorage?: boolean) {
    const storeItem =
      fromLocalStorage === true
        ? localStorage.getItem(key)
        : sessionStorage.getItem(key);

    return storeItem ? storeItem : undefined;
  }

  private load<T>(key: string, fromLocalStorage?: boolean): T {
    const storeItem =
      fromLocalStorage === true
        ? localStorage.getItem(key)
        : sessionStorage.getItem(key);

    if (storeItem) {
      return JSON.parse(storeItem) as T;
    }

    return undefined;
  }
}
