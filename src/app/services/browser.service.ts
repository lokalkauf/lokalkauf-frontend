import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

enum DEVICE {
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
}

interface BrowserSupport {
  device: DEVICE;
  browserName: string;
  version: number;
}

@Injectable()
export class BrowserService {
  supportedBrowsers: BrowserSupport[] = [
    {
      device: DEVICE.DESKTOP,
      browserName: 'Safari',
      version: 13,
    },
    {
      device: DEVICE.DESKTOP,
      browserName: 'Chrome',
      version: 80,
    },
    {
      device: DEVICE.DESKTOP,
      browserName: 'Firefox',
      version: 70,
    },
    {
      device: DEVICE.DESKTOP,
      browserName: 'IE',
      version: 11,
    },
    {
      device: DEVICE.DESKTOP,
      browserName: 'MS-Edge-Chromium',
      version: 80,
    },
    {
      device: DEVICE.DESKTOP,
      browserName: 'MS-Edge',
      version: 12,
    },
    {
      device: DEVICE.DESKTOP,
      browserName: 'Opera',
      version: 68,
    },
    {
      device: DEVICE.MOBILE,
      browserName: 'Safari',
      version: 13,
    },
    {
      device: DEVICE.MOBILE,
      browserName: 'Chrome',
      version: 80,
    },
    {
      device: DEVICE.MOBILE,
      browserName: 'Firefox',
      version: 70,
    },
  ];

  constructor(private deviceDetectorService: DeviceDetectorService) {}

  getCurrentBrowser(): string {
    return this.deviceDetectorService.browser;
  }

  isBrowserSupported(): boolean {
    const isDesktop = this.deviceDetectorService.isDesktop();

    console.log(this.deviceDetectorService.browser_version);

    const foundBrowsers = this.supportedBrowsers.filter(
      (x) =>
        x.device === (isDesktop ? DEVICE.DESKTOP : DEVICE.MOBILE) &&
        this.deviceDetectorService.browser.startsWith(x.browserName)
    );

    if (foundBrowsers && foundBrowsers.length > 0) {
      const detectedBrowserVersionArray = this.deviceDetectorService.browser_version.split(
        '.'
      );
      const detectedBrowserVersionMajor: number =
        detectedBrowserVersionArray && detectedBrowserVersionArray.length > 0
          ? +detectedBrowserVersionArray[0]
          : 0;
      return detectedBrowserVersionMajor >= foundBrowsers[0].version;
    }
    return false;
  }
}
