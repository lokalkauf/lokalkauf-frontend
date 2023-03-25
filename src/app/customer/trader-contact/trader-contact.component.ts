import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { EMail } from '../../models/email';
import { EMailService } from '../../services/email.service';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TraderProfile } from '../../models/traderProfile';
import { ErrorService } from '../../services/error.service';
import { StorageService } from '../../services/storage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-trader-contact',
  templateUrl: './trader-contact.component.html',
  styleUrls: ['./trader-contact.component.scss'],
  providers: [EMailService],
})
export class TraderContactComponent implements OnInit {
  @Input() trader: TraderProfile;

  contactFormVisible = false;

  contactForm = new UntypedFormGroup({
    mail_message: new UntypedFormControl('', [Validators.required]),
    mail_contact: new UntypedFormControl('', [Validators.required]),
    agbRead: new UntypedFormControl(false, [Validators.requiredTrue]),
  });

  get mail_contact() {
    return this.contactForm.get('mail_contact');
  }

  get mail_message() {
    return this.contactForm.get('mail_message');
  }

  get trader_mail() {
    if (this.trader.storeEmail) {
      return this.trader.storeEmail;
    } else {
      return this.trader.email;
    }
  }

  get agbRead() {
    return this.contactForm.get('agbRead');
  }

  getTraderMapLink() {
    if (this.trader.city) {
      const url = `${this.trader.street}+${this.trader.number}%2C${this.trader.city}%2C+Deutschland`;
      return `https://www.google.com/maps/search/?api=1&query=${url.replace(
        ' ',
        '%20'
      )}`;
    }
  }

  getAdress() {
    // check for at least one mandantory field, if you visit the profile detail page at least once
    if (this.trader.city) {
      return ` ${this.trader.street ? this.trader.street : ''} ${
        this.trader.number ? this.trader.number : ''
      }
      <br />${this.trader.postcode ? this.trader.postcode : ''} ${
        this.trader.city
      }
      `;
    }
  }

  toggleContactForm(isEnabled = true) {
    if (isEnabled) {
      this.contactFormVisible = !this.contactFormVisible;
    }
  }

  openOnlineshop() {
    if (this.trader.onlineshop) {
      window.open(this.trader.onlineshop, '_blank');
    }
  }

  constructor(
    private router: Router,
    public location: Location,
    private mailService: EMailService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {}

  async onSubmit(receiverName: string) {
    const receiverEmail = this.trader_mail;
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
      title: 'Jemand hat Dir eine Anfrage gestellt',
      toEMail: receiverEmail,
      toName: receiverName,
      tempalteId: 'd-5a22167efb9e40558daaf9ccc39a843d',
      templateIdCopy: 'd-168373d4387f494ea5f67c237dbe80a0',
    };

    const templateVars = {
      trader_name: receiverName,
      trader_message: this.mail_message.value,
      contact_information: this.mail_contact.value,
    };
    // TODO finalize call for backend sending mail

    try {
      await this.mailService.send(email, templateVars);
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
