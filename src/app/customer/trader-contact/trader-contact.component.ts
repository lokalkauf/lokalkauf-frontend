import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Trader } from '../../models/trader';
import { EMail } from '../../models/email';
import { EMailService } from '../../services/email.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TraderProfile } from '../../models/traderProfile';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-trader-contact',
  templateUrl: './trader-contact.component.html',
  styleUrls: ['./trader-contact.component.scss'],
  providers: [EMailService],
})
export class TraderContactComponent implements OnInit {
  @Input() trader: Observable<Trader>;

  mailModel = new EMail();
  submitted = false;
  error: {};

  traderPhone: Observable<string>;
  traderMail: Observable<string>;

  contactForm = new FormGroup({
    mail_message: new FormControl('', [Validators.required]),
    mail_contact: new FormControl('', [Validators.required]),
    agbRead: new FormControl('', [Validators.requiredTrue]),
  });

  get mail_contact() {
    return this.contactForm.get('mail_contact');
  }

  get mail_message() {
    return this.contactForm.get('mail_message');
  }

  get agbRead() {
    return this.contactForm.get('agbRead');
  }

  constructor(
    private router: Router,
    private mailService: EMailService,
    private db: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let traderId;
    this.route.params.subscribe((p) => {
      traderId = p.traderId;
      this.fillTraderPhoneAndMail(traderId);
    });
  }

  fillTraderPhoneAndMail(traderId: string): void {
    const docReference = this.db.collection('Traders').doc(traderId);
    docReference.get().subscribe((p) => {
      if (p.exists) {
        console.log('Trader found!');
        const traderData = p.data();
        this.traderPhone = traderData.telephone;
        this.traderMail = traderData.email;
      } else {
        // doc.data() will be undefined in this case
        console.log('No such trader!');
      }
    });
  }

  async onSubmit() {
    this.submitted = true;
    // TODO finalize call for backend sending mail
    console.log('form submitted');

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
    } catch (e) {
      // TODO show ERRORs
      // switch (e.code) {
      //   case 'auth/email-already-in-use':
      //     this.registrationForm.setErrors({
      //       emailInUse: true,
      //     });
      //     break;
      //   case 'auth/invalid-email':
      //     this.registrationForm.setErrors({
      //       invalidEmail: true,
      //     });
      //     break;
      //   case 'auth/operation-not-allowed':
      //     this.registrationForm.setErrors({
      //       undefinedError: true,
      //     });
      //     break;
      //   case 'auth/weak-password':
      //     this.registrationForm.setErrors({
      //       weakPassword: true,
      //     });
      //     break;
      //   default:
      //     this.registrationForm.setErrors({
      //       undefinedError: true,
      //     });
      //     break;
      // }
    }
  }

  gotoHome() {
    this.router.navigate(['/']);
  }
}
