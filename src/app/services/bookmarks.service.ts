import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { Bookmark } from '../models/bookmark';
import { AngularFirestore } from '@angular/fire/firestore';
import { BookmarkList } from '../models/bookmarkList';
import { map, tap } from 'rxjs/operators';
import { BookmarkListPublic } from '../models/bookmarkListPublic';
import { count } from 'console';

export interface LocalBookmark {
  id: string;
  name: string;
}

export enum BOOKMARK_TYPE {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  UNKNOWN = 'UNKNOWN',
}

export interface ActiveBookmark {
  id: string;
  type: BOOKMARK_TYPE;
}

@Injectable()
export class BookmarksService {
  public bookmarkSubject: Subject<number> = new Subject<number>();
  currentBookmarklist = new BehaviorSubject<BookmarkList>(undefined);
  currentBookmarklistType = new BehaviorSubject<BOOKMARK_TYPE>(BOOKMARK_TYPE.UNKNOWN);

  constructor(private readonly storageService: StorageService, private readonly db: AngularFirestore) {
    this.currentBookmarklist.subscribe((bookmarkList) => {
      if (bookmarkList) {
        this.bookmarkSubject.next(bookmarkList.bookmarks.length);
      } else {
        this.bookmarkSubject.next(null);
      }
    });
  }

  addTrader(bookmark: Bookmark) {
    if (this.currentBookmarklist && this.currentBookmarklistType.getValue() === BOOKMARK_TYPE.PRIVATE) {
      const currentList = this.currentBookmarklist.getValue();
      if (currentList) {
        if (currentList.bookmarks.length === 0) {
          currentList.bookmarks.push(bookmark);
        } else {
          if (currentList.bookmarks.filter((y) => y.traderid === bookmark.traderid).length === 0) {
            currentList.bookmarks.push(bookmark);
          }
        }
        this.updateBookmarkList(currentList);
      }
    }
  }

  removeTrader(bookmark: Bookmark) {
    if (this.currentBookmarklist && this.currentBookmarklistType.getValue() === BOOKMARK_TYPE.PRIVATE) {
      const currentList = this.currentBookmarklist.getValue();
      if (currentList) {
        if (this.isTraderInBookmarks(bookmark.traderid)) {
          currentList.bookmarks = currentList.bookmarks.filter((y) => y.traderid !== bookmark.traderid);
          this.updateBookmarkList(currentList);
        }
      }
    }
  }

  async addTraderToBookmark(bookmarkId: string, bookmark: Bookmark) {
    if (bookmarkId === this.currentBookmarklist.getValue().id) {
      return await this.addTrader(bookmark);
    }

    const remoteBookmark = await this.db.collection<BookmarkList>(`Merkliste`).doc<BookmarkList>(bookmarkId).get().toPromise();

    if (remoteBookmark) {
      const r = remoteBookmark.data();
      if (r) {
        console.log('ffffff', r, bookmark);
        if (r.bookmarks.filter((y) => y.traderid === bookmark.traderid).length === 0) {
          r.bookmarks.push(bookmark);
          await this.db.collection(`Merkliste`).doc(bookmarkId).update({ bookmarks: r.bookmarks });
        }
      }
    }
  }

  removeTraderFromBookmark(traderid: string, bookmarkId: string) {
    throw new Error('not implemented yet.');
  }

  async deleteBookmark() {
    const bookmarkid = this.storageService.loadActiveBookmarkId();
    if (bookmarkid) {
      if (bookmarkid.type === BOOKMARK_TYPE.PRIVATE) {
        this.storageService.removePrivateBookmark(bookmarkid.id);
        await this.db.collection<Omit<BookmarkList, 'id'>>(`Merkliste`).doc(bookmarkid.id).delete();
      } else {
        this.storageService.removePublicBookmark(bookmarkid.id);
      }
    }
    this.clearCurrentBookmarklist();
  }

  isTraderInBookmarks(traderid: string): boolean {
    if (this.currentBookmarklist.getValue() && this.currentBookmarklist.getValue().bookmarks) {
      return this.currentBookmarklist.getValue().bookmarks.filter((trader) => trader.traderid === traderid).length > 0;
    }
  }

  public async updateBookmarkList(bookmarkList: BookmarkList) {
    if (!bookmarkList.id) {
      console.log('new');
      const result = await this.db.collection<Omit<BookmarkList, 'id'>>('Merkliste').add(bookmarkList);
      if (result) {
        this.storageService.savePrivateBookmark({
          id: result.id,
          name: bookmarkList.name,
        });
        this.storageService.saveActiveBookmarkId({
          id: result.id,
          type: BOOKMARK_TYPE.PRIVATE,
        });

        const returnValue = { ...bookmarkList, id: result.id };
        this.updateLocal(returnValue);
        return returnValue;
      }
    } else {
      console.log('upd', bookmarkList.id);
      const update = this.db.collection<Omit<BookmarkList, 'id'>>('Merkliste').doc<Omit<BookmarkList, 'id'>>(bookmarkList.id).update(bookmarkList);
      this.updateLocal(bookmarkList);
      return update;
    }
  }

  public loadActiveBookmarkList(activeBookmark: ActiveBookmark, loadIfPublic: boolean = false): Observable<BookmarkList> {
    if (!activeBookmark) {
      return of(undefined);
    }

    return activeBookmark.type === BOOKMARK_TYPE.PRIVATE ? this.loadBookmarkList(activeBookmark.id) : this.loadPublicBookmarkList(activeBookmark.id, loadIfPublic);
  }

  public loadBookmarkList(id: string): Observable<BookmarkList> {
    if (id) {
      return this.db
        .collection<BookmarkList>(`Merkliste`)
        .doc<Omit<BookmarkList, 'id'>>(id)
        .valueChanges()
        .pipe(
          map((bookmarkList) => {
            console.log('load from remote', bookmarkList);
            const retval = { ...bookmarkList, id };
            if (bookmarkList) {
              this.updateLocal(retval);
            }
            return bookmarkList ? retval : undefined;
          })
        );
    }
    return of(undefined);
  }

  public overwriteBookmarkTraderCounter(counter: number) {
    if (counter > 0) {
      this.bookmarkSubject.next(counter);
    } else {
      this.bookmarkSubject.next(null);
    }
  }

  public loadPublicBookmarkList(id: string, loadForReal: boolean = false): Observable<BookmarkListPublic> {
    if (id) {
      return this.db
        .collection<BookmarkListPublic>(`Merkliste_PUBLIC`)
        .doc<Omit<BookmarkListPublic, 'id'>>(id)
        .valueChanges()
        .pipe(
          map((bookmarkList) => {
            console.log('load PUBLIC from remote', bookmarkList);
            const retval = { ...bookmarkList, id };
            if (bookmarkList && bookmarkList.isActive) {
              if (loadForReal) {
                this.updateLocal(bookmarkList, BOOKMARK_TYPE.PUBLIC);
              }
              return retval;
            } else {
              if (loadForReal) {
                this.updateLocal(undefined, BOOKMARK_TYPE.PUBLIC);
              }
              return undefined;
            }
          })
        );
    }
    return of(undefined);
  }

  public clearCurrentBookmarklist() {
    this.storageService.saveActiveBookmarkId({
      id: '',
      type: BOOKMARK_TYPE.UNKNOWN,
    });
    this.updateLocal(undefined);
  }

  public getLocalBookmarkLists(): LocalBookmark[] {
    return this.storageService.loadPrivateBookmarks().filter((bookmark) => bookmark.id !== '');
  }

  public getLocalPublicBookmarklists(): LocalBookmark[] {
    return this.storageService.loadPublicBookmarks().filter((bookmark) => bookmark.id !== '');
  }

  public importToLocalStorage(bookmarkList: BookmarkList): boolean {
    if (!bookmarkList || !bookmarkList.id || !bookmarkList.name) {
      return false;
    }
    this.storageService.savePrivateBookmark({
      id: bookmarkList.id,
      name: bookmarkList.name,
    });
    this.storageService.saveActiveBookmarkId({
      id: bookmarkList.id,
      type: BOOKMARK_TYPE.PRIVATE,
    });
    return true;
  }

  public async publishLocalBookmarkList() {
    if (this.currentBookmarklist && this.currentBookmarklist.getValue()) {
      const bookmarkList = this.currentBookmarklist.getValue();
      if (bookmarkList.id) {
        let publicid: string;
        if (!bookmarkList.publicid) {
          const result = await this.db.collection<Omit<BookmarkListPublic, 'id'>>('Merkliste_PUBLIC').add({
            creationdate: new Date().toLocaleString(),
          } as BookmarkListPublic);
          publicid = result.id;
        } else {
          publicid = bookmarkList.publicid;
        }

        if (publicid) {
          bookmarkList.publicid = publicid;
          bookmarkList.publicactive = true;
          this.updateBookmarkList(bookmarkList);
        }
      }
    }
  }

  public unpublishLocalBookmarkList() {
    if (this.currentBookmarklist && this.currentBookmarklist.getValue()) {
      const bookmarkList = this.currentBookmarklist.getValue();
      bookmarkList.publicactive = false;
      this.updateBookmarkList(bookmarkList);
    }
  }

  public importPublicBookmarklist(bookmarkList: BookmarkList) {
    this.storageService.savePublicBookmark({
      id: bookmarkList.id,
      name: bookmarkList.name,
    });
    this.storageService.saveActiveBookmarkId({
      id: bookmarkList.id,
      type: BOOKMARK_TYPE.PUBLIC,
    });
    this.updateLocal(bookmarkList, BOOKMARK_TYPE.PUBLIC);
  }

  private updateLocal(bookmarklist: BookmarkList, type: BOOKMARK_TYPE = BOOKMARK_TYPE.PRIVATE) {
    console.log('updateLocal', bookmarklist);
    this.currentBookmarklist.next(bookmarklist);
    this.currentBookmarklistType.next(type);
  }
}
