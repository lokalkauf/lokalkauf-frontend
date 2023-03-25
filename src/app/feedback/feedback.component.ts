import { Location, TranslationWidth } from '@angular/common';
import { Component } from '@angular/core';
import * as EmailValidatorTS from 'email-validator';
import { EMailService } from '../services/email.service';
import { EMail } from '../models/email';
import { ErrorService } from '../services/error.service';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent {
  feedbackForm = new UntypedFormGroup({
    message: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required]),
    agbRead: new UntypedFormControl('', [Validators.requiredTrue]),
  });

  get email() {
    return this.feedbackForm.get('email');
  }

  get message() {
    return this.feedbackForm.get('message');
  }

  get agbRead() {
    return this.feedbackForm.get('agbRead');
  }

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
    if (this.feedbackForm.invalid) {
      console.log('okoko');
      this.feedbackForm.get('message').markAsTouched();
      this.feedbackForm.get('email').markAsTouched();
      this.feedbackForm.get('agbRead').markAsTouched();
      return;
    }

    if (
      this.message &&
      this.message.value &&
      this.agbRead.value &&
      (!this.email || this.validMail(this.email.value))
    ) {
      try {
        this.mailService.send(
          {
            fromName: this.email.value,
            fromEMail: this.email.value,
            toEMail: 'info@lokalkauf.org',
            title: 'Feedbacknachricht',
            tempalteId: 'd-2156dd98911d4d7bae994c2974628ab9',
            templateIdCopy: 'd-46206f6d5fd74e90af18c91cfe16893e',
          } as EMail,
          {
            feedback_mail: this.email.value,
            feedback_message: this.message.value,
          }
        );
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
