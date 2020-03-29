import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  mode: string;

  constructor(
    private user: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private errorService: ErrorService
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe((params) => {
      this.mode = params.mode;
      switch (this.mode) {
        case 'resetPassword':
          // Display reset password handler and UI.
          // TODO: Decide if we place it here or in the password reset component
          // this.handleResetPassword(params.actionCode, params.lang);
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
          console.log('Invalid mode' + this.mode);
          this.mode = 'invalid';
      }
    });
  }

  /*  async handleResetPassword(actionCode: string, lang: string) {
    try {
      await this.user.verifyPasswordReset(actionCode);
    } catch (error) {
      console.error(error);
      // TODO: Show user instruction on UI
    }
  } */

  async handleRecoverEmail(actionCode: string, lang: string) {
    try {
      await this.user.revokeEmailChange(actionCode);
    } catch (error) {
      console.error(error);
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
      console.error(error);
      this.errorService.publishByText(
        'E-Mail konnte nicht verifiziert werden',
        'Der Verifizierungslink wurde entweder bereits genutzt oder ist ungültig.' +
        'Bitte versuche Deine E-Mail erneut zu verifizeren oder kontaktiere uns.'
      );
    }
  }
}
