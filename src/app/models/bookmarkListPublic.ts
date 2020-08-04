import { Bookmark } from './bookmark';

export interface BookmarkListPublic {
  id?: string;
  name: string;
  description?: string;
  creationdate: string;
  bookmarks: Bookmark[];
  updatedate?: string;
  geojson?: string;
  isactive?: boolean;
}
