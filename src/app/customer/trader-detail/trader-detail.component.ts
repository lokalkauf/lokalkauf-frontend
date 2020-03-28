import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CarouselEntry } from 'src/app/models/carouselEntry';
import { Link } from 'src/app/models/link';
import { TraderProfile } from 'src/app/models/traderProfile';
import { Trader } from 'src/app/models/trader';
import { EMail } from '../../models/email';
import { EMailService } from '../../services/email.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-trader-detail',
  templateUrl: './trader-detail.component.html',
  styleUrls: ['./trader-detail.component.scss'],
})
export class TraderDetailComponent implements OnInit {
  trader$: Observable<Omit<TraderProfile, 'id'>>;
  productAmount$: Observable<number>;
  carouselSlides: Array<CarouselEntry> = new Array<CarouselEntry>();

  showMoreText = false;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private mailService: EMailService,
    private router: Router,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.trader$ = this.route.params.pipe(
      flatMap((params) =>
        this.db
          .collection('Traders')
          .doc<Omit<TraderProfile, 'id'>>(params.id)
          .valueChanges()
          .pipe(
            tap(console.log),
            map((x) => ({ ...x, id: params.id }))
          )
      )
    );

    this.productAmount$ = this.route.params.pipe(
      flatMap((params) =>
        this.db
          .collection<Omit<Trader, 'id'>>(`Traders/${params.id}/Products`)
          .get()
          .pipe(map((snap) => snap.size))
      )
    );

    // For Demo purposes:
    const carouselEntry = new CarouselEntry('/assets/start-image.png');
    carouselEntry.setLink(new Link('go to start page', '/', true));
    this.carouselSlides.push(carouselEntry);
    this.carouselSlides.push(
      new CarouselEntry('/assets/start-image.png', 'Test description')
    );
  }

  shortenText(inputText: string) {
    if (inputText.length > 200) {
      return inputText.substring(0, 200);
    } else {
      return inputText;
    }
  }

  async onSubmit() {
    // TODO finalize call for backend sending mail
    console.log('trader contact submitted');

    const email: EMail = {
      acceptedAgb: false,
      fromEMail: '',
      fromPhone: '',
      fromPreferredContact: '',
      fromName: '',
      id: 0,
      message: '',
      title: '',
      toEMail: '',
      toName: '',
    };

    try {
      await this.mailService.send(email);
      this.router.navigate(['/contacted']);
    } catch (e) {
      this.errorService.publishByText(
        'Nachricht konnte nicht verschickt werden',
        'Aufgrund eines Systemfehlers konnte die Nachricht an ' +
          'den Händler nicht verschickt werden. Bitte versuche es erneut oder kontaktiere den Support.'
      );
    }
  }
}
