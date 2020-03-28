import { Link } from './link';

export class CarouselEntry {
  private imageUrl: string;
  private heading: string;
  private link: Link;

  public constructor(imageUrl: string, heading: string = null) {
    this.imageUrl = imageUrl;
    this.heading = heading;
  }

  public getImageUrl() {
    return this.imageUrl;
  }

  public getHeading() {
    return this.heading;
  }

  public setLink(link: Link) {
    this.link = link;
  }

  public getLink() {
    return this.link;
  }
}
