import { Location, TranslationWidth } from '@angular/common';
import { Component } from '@angular/core';
import * as EmailValidatorTS from 'email-validator';
import { EMailService } from '../services/email.service';
import { EMail } from '../models/email';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent {
  message: string;
  email: string;
  agb: boolean;
  showError: boolean;
  mailSent = false;

  constructor(
    private location: Location,
    private mailService: EMailService,
    private errorService: ErrorService
  ) {
    this.showError = false;
  }

  verwerfen() {
    this.location.back();
  }

  absenden() {
    if (
      this.message &&
      this.agb &&
      (!this.email || this.validMail(this.email))
    ) {
      const htmlMessage = `<div style="text-align:center;">
      <img src="https://lokalkauf-staging.web.app/assets/logo.png" style="width:800px;height:300px;"/>
            <h2>Bestätigung deiner Anfrage</h2>
            <h4>Du hast eine Anfrage versendet:</h4>
            <p>${this.message}</p>
            <b>Folgende Kontaktinformationen wurden hinterlassen:</b>
            <p>${this.email ? this.email : '-'}</p>
            <br>
            <b> Dein LokalKauf Team </b>
      </div>`;

      try {
        this.mailService.send({
          fromName: this.email,
          fromEMail: this.email,
          toEMail: 'info@lokalkauf.org',
          title: 'Feedbacknachricht',
          message: htmlMessage,
        } as EMail);
        this.mailSent = true;
        this.showError = false;
      } catch (e) {
        this.errorService.publishByText(
          'Nachricht konnte nicht verschickt werden',
          'Aufgrund eines Systemfehlers konnte die Nachricht an ' +
            'den Händler nicht verschickt werden. Bitte versuche es erneut oder kontaktiere den Support.'
        );
      }
    } else {
      this.showError = true;
    }
  }
  validMail(mail: string): boolean {
    return EmailValidatorTS.validate(mail);
  }

  goBack() {
    this.location.back();
  }
}
