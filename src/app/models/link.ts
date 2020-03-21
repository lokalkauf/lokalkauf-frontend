export class Link {
  private name: string;
  private url: string;
  private feedback: string;

  constructor(name: string, urlOrFeedback: string, useUrl: true)
  {
    this.name = name;

    if (useUrl) {
      this.url = urlOrFeedback;
    } else {
      this.feedback = urlOrFeedback;
    }
  }

  getName(): string {
    return this.name;
  }

  getUrl(): string {
    return this.url;
  }

  getFeedback(): string {
    return this.feedback;
  }
}
