import { Component, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService, LoggedInUserState } from '../../services/user.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  loggedInUserState$: Observable<LoggedInUserState>;

  mailResendedMessage: string;

  constructor(private user: UserService, router: Router) {
    this.loggedInUserState$ = user.loggedInUserState$.pipe(
      filter((loggedInUser) => loggedInUser != null)
    );
    user.isLoggedIn$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigateByUrl('/trader/login');
      }
    });
  }

  async resendEmailVerification() {
    this.mailResendedMessage = 'Bestätigungsmail wurde erneut versendet!';
    await this.user.resendEmailVerification();
  }
}
