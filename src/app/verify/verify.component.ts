import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ErrorService } from 'src/app/services/error.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from './must-match.validator';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  mode: string;
  passwordForm = this.formBuilder.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validator: MustMatch('password', 'confirmPassword'),
    }
  );
  verifiedActionCode: string;

  constructor(
    private user: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document: Document
  ) {}

  get password() {
    return this.passwordForm.get('password');
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe((params) => {
      this.mode = params.mode;
      switch (this.mode) {
        case 'resetPassword':
          // Display reset password handler and UI.
          this.handleResetPassword(params.oobCode, params.lang);
          break;
        case 'recoverEmail':
          // Display email recovery handler and UI.
          this.handleRecoverEmail(params.oobCode, params.lang);
          break;
        case 'verifyEmail':
          // Display email verification handler and UI.
          this.handleVerifyEmail(params.oobCode, params.lang);
          break;
        default:
          // Error: invalid mode.
          this.mode = 'invalid';
      }
    });
  }

  async handleResetPassword(actionCode: string, lang: string) {
    try {
      await this.user.verifyPasswordReset(actionCode).then(() => {
        this.verifiedActionCode = actionCode;
      });
    } catch (error) {
      console.error(error);
      this.errorService.publishByText(
        'Deine Passwort-Änderungsanfrage ist ungültig.',
        'Bitte erstelle eine neue Passwort-Änderungsanfrage'
      );
    }
  }

  async confirmPasswordReset() {
    try {
      await this.user
        .confirmPasswordReset(this.verifiedActionCode, this.password.value)
        .then(() => {
          this.mode = 'passwordChangeCompleted';
        });
    } catch (error) {
      this.errorService.publishByText(
        'Dein neues Passwort konnte nicht gespeichert werden.',
        'Bitte versuche es nochmal.'
      );
    }
  }

  async handleRecoverEmail(actionCode: string, lang: string) {
    try {
      await this.user.revokeEmailChange(actionCode);
    } catch (error) {
      this.errorService.publishByText(
        'E-Mail konnte nicht wiederhergestellt werden',
        'Bitte prüfe Dein Profil oder kontaktiere uns.'
      );
    }
  }

  async handleVerifyEmail(actionCode: string, lang: string) {
    try {
      await this.user.verifyEmail(actionCode);
    } catch (error) {
      this.errorService.publishByText(
        'E-Mail konnte nicht verifiziert werden',
        'Der Verifizierungslink wurde entweder bereits genutzt oder ist ungültig.' +
          'Bitte versuche Deine E-Mail erneut zu verifizeren oder kontaktiere uns.'
      );
    }
  }

  forceReload() {
    this.document.location.href = window.location.origin + '/trader/profile';
  }
}
