import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { Bookmark } from '../models/bookmark';
import { AngularFirestore } from '@angular/fire/firestore';
import { BookmarkList } from '../models/bookmarkList';
import { map, tap } from 'rxjs/operators';

export enum BOOKMARK_MODE {
  LOCAL = 'LOCAL',
  REMOTE = 'REMOTE',
  FOLLOWED = 'FOLLOWED',
}

export interface LocalBookmark {
  id: string;
  name: string;
}

@Injectable()
export class BookmarksService {
  public bookmarkSubject: Subject<number> = new Subject<number>();
  private bookmarkMode: BOOKMARK_MODE = BOOKMARK_MODE.LOCAL;

  currentBookmarklist = new BehaviorSubject<BookmarkList>(undefined);

  constructor(
    private readonly storageService: StorageService,
    private readonly db: AngularFirestore
  ) {
    this.currentBookmarklist.subscribe((bookmarkList) => {
      if (bookmarkList) {
        this.bookmarkSubject.next(bookmarkList.bookmarks.length);
      } else {
        this.bookmarkSubject.next(null);
      }
    });
  }

  addTrader(bookmark: Bookmark) {
    if (this.currentBookmarklist) {
      const currentList = this.currentBookmarklist.getValue();
      if (currentList) {
        if (currentList.bookmarks.length === 0) {
          currentList.bookmarks.push(bookmark);
        } else {
          if (
            currentList.bookmarks.filter(
              (y) => y.traderid === bookmark.traderid
            ).length === 0
          ) {
            currentList.bookmarks.push(bookmark);
          }
        }
        this.updateBookmarkList(currentList);
      }
    }
  }

  removeTrader(bookmark: Bookmark) {
    if (this.currentBookmarklist) {
      const currentList = this.currentBookmarklist.getValue();
      if (currentList) {
        if (this.isTraderInBookmarks(bookmark.traderid)) {
          currentList.bookmarks = currentList.bookmarks.filter(
            (y) => y.traderid !== bookmark.traderid
          );
          this.updateBookmarkList(currentList);
        }
      }
    }
  }

  deleteBookmarks() {
    console.log('NOT IMPLEMENTED YET');
    // this.storageService.saveBookmarks([]);
  }

  isTraderInBookmarks(traderid: string): boolean {
    if (
      this.currentBookmarklist.getValue() &&
      this.currentBookmarklist.getValue().bookmarks
    ) {
      return (
        this.currentBookmarklist
          .getValue()
          .bookmarks.filter((trader) => trader.traderid === traderid).length > 0
      );
    }
  }

  public async updateBookmarkList(bookmarkList: BookmarkList) {
    if (!bookmarkList.id) {
      console.log('new');
      const result = await this.db
        .collection<Omit<BookmarkList, 'id'>>('Merkliste')
        .add(bookmarkList);
      if (result) {
        const oldActiveId = this.storageService.loadActiveBookmarkId();
        this.storageService.savePrivateBookmark({
          id: result.id,
          name: bookmarkList.name,
        });
        this.storageService.saveActiveBookmarkId(result.id);

        const returnValue = { ...bookmarkList, id: result.id };
        this.updateLocal(returnValue);
        return returnValue;
      }
    } else {
      console.log('upd', bookmarkList.id);
      const update = this.db
        .collection<Omit<BookmarkList, 'id'>>('Merkliste')
        .doc(bookmarkList.id)
        .update(bookmarkList);
      this.updateLocal(bookmarkList);
      return update;
    }
  }

  public loadBookmarkList(id: string): Observable<BookmarkList> {
    if (id) {
      return this.db
        .collection<BookmarkList>(`Merkliste`)
        .doc<Omit<BookmarkList, 'id'>>(id)
        .valueChanges()
        .pipe(
          map((bookmarkList) => {
            console.log('load from remote');
            this.updateLocal(bookmarkList);
            return { ...bookmarkList };
          })
        );
    }
    return of(undefined);
  }

  public clearCurrentBookmarklist() {
    this.storageService.saveActiveBookmarkId('');
    this.updateLocal(undefined);
  }

  public getLocalBookmarkLists(): LocalBookmark[] {
    return this.storageService
      .loadPrivateBookmarks()
      .filter((bookmark) => bookmark.id !== '');
  }

  private updateLocal(bookmarklist: BookmarkList) {
    console.log('updateLocal', bookmarklist);
    this.currentBookmarklist.next(bookmarklist);
  }
}
