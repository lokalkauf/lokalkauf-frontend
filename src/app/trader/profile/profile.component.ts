import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { UserService, LoggedInUserState } from 'src/app/services/user.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  loggedInUserState$: Observable<LoggedInUserState>;

  delivery = new FormControl(false);
  pickup = new FormControl(false);

  constructor(private user: UserService, private router: Router) {
    this.loggedInUserState$ = user.loggedInUserState$;
    user.isLoggedIn$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigateByUrl('/trader/login');
      }
    });
  }

  ngOnInit() {
    this.loggedInUserState$.subscribe((loggedInUserState) => {
      console.log(loggedInUserState);
      const traderProfile = loggedInUserState.traderProfile;
      if (traderProfile.pickup !== this.pickup.value) {
        this.pickup.setValue(loggedInUserState.traderProfile.pickup);
      }
      if (traderProfile.delivery !== this.delivery.value) {
        this.delivery.setValue(loggedInUserState.traderProfile.delivery);
      }
    });

    this.delivery.valueChanges.subscribe(async (delivery) => {
      await this.user.updateTraderProfile({ delivery });
    });

    this.pickup.valueChanges.subscribe(async (pickup) => {
      await this.user.updateTraderProfile({ pickup });
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
