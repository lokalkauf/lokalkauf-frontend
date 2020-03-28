import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { UserService, LoggedInUserState } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  loggedInUserState$: Observable<LoggedInUserState>;

  constructor(private user: UserService, private router: Router) {
    this.loggedInUserState$ = user.loggedInUserState$;
    user.isLoggedIn$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigateByUrl('/trader/login');
      }
    });
  }

  async resendEmailVerification() {
    await this.user.resendEmailVerification();
    // TODO: Inform user
  }

  async logout() {
    await this.user.logout();
  }
}
