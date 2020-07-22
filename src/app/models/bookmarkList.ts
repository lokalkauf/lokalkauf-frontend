import { Bookmark } from './bookmark';

export interface BookmarkList {
  id?: string;
  publicid?: string;
  name: string;
  description?: string;
  creationdate: string;
  bookmarks: Bookmark[];
  updatedate?: string;
  geojson?: string;
}
