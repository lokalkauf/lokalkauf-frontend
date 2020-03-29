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
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-trader-contact',
  templateUrl: './trader-contact.component.html',
  styleUrls: ['./trader-contact.component.scss'],
  providers: [EMailService],
})
export class TraderContactComponent implements OnInit {
  @Input() trader: TraderProfile;


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
    private errorService: ErrorService
  ) {}

  ngOnInit(): void { }

  async onSubmit(receiverEmail: string, receiverName: string) {
    if (!this.agbRead) {
      this.errorService.publishByText(
        'AGB und Datenschutzerklärung wurden nicht gelesen',
        'Bitte vergewissere dich, dass du die AGB und die Datenschutzerklärungen ' +
          'gelesen hast, bevor du eine Nachricht an den Händler abschickst.'
      );

      return;
    }

    const email: EMail = {
      acceptedAgb: this.agbRead.value,
      fromEMail: this.mail_contact.value,
      fromPhone: this.mail_contact.value,
      fromPreferredContact: '',
      fromName: this.mail_contact.value,
      id: 0,
      message: this.mail_message.value,
      title: 'Jemand hat eine Anfrage an Sie gestellt',
      toEMail: receiverEmail,
      toName: receiverName,
    };

    // TODO finalize call for backend sending mail
    console.log(email);

    try {
      await this.mailService.send(email);
      // this.router.navigate(['/contacted']);
    } catch (e) {
      this.errorService.publishByText(
        'Nachricht konnte nicht verschickt werden',
        'Aufgrund eines Systemfehlers konnte die Nachricht an ' +
          'den Händler nicht verschickt werden. Bitte versuche es erneut oder kontaktiere den Support.'
      );
    }
  }
}
