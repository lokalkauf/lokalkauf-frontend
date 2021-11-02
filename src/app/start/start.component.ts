import {
  Component,
  OnInit,
  InjectionToken,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Link } from '../models/link';
import { Router } from '@angular/router';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';
import { FormControl, Validators } from '@angular/forms';
import { uiTexts } from 'src/app/services/uiTexts';
import { TextService } from '../services/text.service';
import { Testimonial } from '../reusables/lk-testimonal/lk-testimonial.component';
import { Observable, of } from 'rxjs';
import { LkVideo } from '../reusables/lk-videoplayer/lk-videoplayer.component';

export interface Press {
  date: string;
  title: string;
  content: string;
  link: string;
  img: string;
}

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit {
  links = [
    new Link('Bäcker', '/', true),
    new Link('Fashion ', '#fashion', false),
    new Link('Metzger', '#fleisch', false),
    new Link('Kiosk', '#bier', false),
    new Link('Weiteres', '/test', true),
  ];

  MAT_AUTOCOMPLETE_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
  DEFAULT = 'DEFAULT';

  lat: number;
  lng: number;

  coovalue: string;
  plz: string;
  coords: string;
  suggestion: any;

  currentPosition: Array<number>;
  disabledLosButton: boolean;

  isLoggedIn = false;

  preSelectedValue: any;

  locationFormControl = new FormControl(null, [Validators.required]);

  testimonials = [];

  testimonialsAsync$: Observable<Testimonial[]>;
  press$: Observable<Press[]>;

  adCampaignVideos$: Observable<LkVideo[]> = of([
    {
      small: '../../assets/campaign/LK_Baecker-270.mp4',
      big: '../../assets/campaign/LK_Baecker-1080.mp4',
      preview: '../../assets/campaign/LK_Baecker-270.png',
      showOnMobile: false,
    },
    {
      small: '../../assets/campaign/LK_Bauer-270.mp4',
      big: '../../assets/campaign/LK_Bauer-1080.mp4',
      preview: '../../assets/campaign/LK_Bauer-270.png',
      showOnMobile: false,
    },
    {
      small: '../../assets/campaign/LK_Boutique-270.mp4',
      big: '../../assets/campaign/LK_Boutique-1080.mp4',
      preview: '../../assets/campaign/LK_Boutique-270.png',
      showOnMobile: false,
    },
    {
      small: '../../assets/campaign/LK_Buchhandlung-270.mp4',
      big: '../../assets/campaign/LK_Buchhandlung-1080.mp4',
      preview: '../../assets/campaign/LK_Buchhandlung-270.png',
      showOnMobile: false,
    },
    {
      small: '../../assets/campaign/LK_DingDong-270.mp4',
      big: '../../assets/campaign/LK_DingDong-1080.mp4',
      preview: '../../assets/campaign/LK_DingDong-270.png',
      showOnMobile: false,
    },
    {
      small: '../../assets/campaign/LK_Floristin-270.mp4',
      big: '../../assets/campaign/LK_Floristin-1080.mp4',
      preview: '../../assets/campaign/LK_Floristin-270.png',
      showOnMobile: false,
    },
    {
      small: '../../assets/campaign/LK_Friseur-270.mp4',
      big: '../../assets/campaign/LK_Friseur-1080.mp4',
      preview: '../../assets/campaign/LK_Friseur-270.png',
      showOnMobile: false,
    },
    {
      small: '../../assets/campaign/LK_Deine Stadt_02-270.mp4',
      big: '../../assets/campaign/LK_Deine Stadt_02-1080.mp4',
      preview: '../../assets/campaign/LK_Deine Stadt_02-270.png',
      showOnMobile: false,
    },
    {
      small: '../../assets/campaign/LK_Deine Stadt_03-270.mp4',
      big: '../../assets/campaign/LK_Deine Stadt_03-1080.mp4',
      preview: '../../assets/campaign/LK_Deine Stadt_03-270.png',
      showOnMobile: true,
    },
  ]);

  @ViewChild('searchInput', { read: ElementRef }) searchInput: any;
  constructor(
    public router: Router,
    public userService: UserService,
    private storageService: StorageService,
    textService: TextService
  ) {
    this.disabledLosButton = true;
    this.userService.isLoggedIn$.subscribe((loggedin) => {
      this.isLoggedIn = loggedin;
    });

    this.testimonialsAsync$ = of([
      {
        img: 'user-voice-casabiente.png',
        text: textService.getText(uiTexts.testimonal_1_testimonial),
        name: textService.getText(uiTexts.testimonal_1_testee),
        traderlink: 'trader-detail/ysWSjEfKtSYa18Aij2KoJKKCqUs1',
      } as Testimonial,
      {
        img: 'user-voice-duester.png',
        text: textService.getText(uiTexts.testimonal_2_testimonial),
        name: textService.getText(uiTexts.testimonal_2_testee),
        traderlink: 'trader-detail/C6nOYXF5iCc1ZvVa6yBBf0jtTdk1',
      } as Testimonial,
    ]);

    this.press$ = of([
      {
        date: textService.getText(uiTexts.start_presse_3_date),
        title: textService.getText(uiTexts.start_presse_3_title),
        content: textService.getText(uiTexts.start_presse_3_content),
        link: textService.getText(uiTexts.start_presse_3_link),
        img: 'logo-impact-hub.png',
      },
      {
        date: textService.getText(uiTexts.start_presse_1_date),
        title: textService.getText(uiTexts.start_presse_1_title),
        content: textService.getText(uiTexts.start_presse_1_content),
        link: textService.getText(uiTexts.start_presse_1_link),
        img: 'welt.png',
      },
      {
        date: textService.getText(uiTexts.start_presse_2_date),
        title: textService.getText(uiTexts.start_presse_2_title),
        content: textService.getText(uiTexts.start_presse_2_content),
        link: textService.getText(uiTexts.start_presse_2_link),
        img: 'bitkom.png',
      },
    ]);
  }

  text = uiTexts;

  ngOnInit(): void {}

  registerTrader() {
    this.router.navigateByUrl('/trader/register/new');
  }

  navigateToLocation() {
    const val = this.locationFormControl.value;

    if (!val) {
      this.searchInput.nativeElement.getElementsByTagName('input')[0].focus();
      return;
    }

    this.router.navigate([
      '/localtraders',
      val.coordinates[0],
      val.coordinates[1],
      val.radius,
    ]);

    this.storageService.saveLocation(val);
  }
}
