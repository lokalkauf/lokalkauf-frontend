export class ImageSource {
  url: string;
  size: number;
  name: string;

  static isPartOf(name: string, sourceURL: string) {
    if (sourceURL) {
      const n = ImageSource.nameWithoutExtension(name);
      return sourceURL.indexOf(n) > -1;
    }

    return false;
  }

  static nameWithoutExtension(name: string) {
    return name.substring(0, name.lastIndexOf('.'));
  }
}

export class TraderImage extends ImageSource {
  thumbnail: ImageSource;
}
