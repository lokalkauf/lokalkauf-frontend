import { Component, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { faFacebookF, faTwitter, faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'lk-some',
  templateUrl: './lk-some.component.html',
  styleUrls: ['./lk-some.component.scss'],
})
export class LkSomeComponent {
  faFacebookF = faFacebookF;
  faTwitter = faTwitter;
  faWhatsapp = faWhatsapp;
  faInstagram = faInstagram;

  @Input()
  public someUrl: string;

  constructor(public device: DeviceDetectorService) {}

  getFbLink() {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.someUrl)}`;
  }

  getTwitterLink() {
    return `https://twitter.com/intent/tweet?hashtags=lokalkauf%20%23helfen%20%23einzelhandel%20%23wirvsvirushack&via=lokalkauf&url=${encodeURIComponent(this.someUrl)}`;
  }

  getWhatsappLink() {
    return `https://${this.device.isDesktop() ? 'web' : 'api'}.whatsapp.com/send?phone=&source=&data=&app_absent=&text=${encodeURIComponent(this.someUrl)}`;
  }
}
