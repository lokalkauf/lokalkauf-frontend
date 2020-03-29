import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService, LoggedInUserState } from 'src/app/services/user.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements AfterViewInit {
  loggedInUserState$: Observable<LoggedInUserState>;

  delivery = new FormControl(false);
  pickup = new FormControl(false);

  description = new FormControl('');

  constructor(
    private user: UserService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.loggedInUserState$ = user.loggedInUserState$;
    user.isLoggedIn$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigateByUrl('/trader/login');
      }
    });
  }

  ngAfterViewInit() {
    this.delivery.valueChanges.subscribe(async (delivery) => {
      await this.user.updateTraderProfile({ delivery });
    });

    this.pickup.valueChanges.subscribe(async (pickup) => {
      await this.user.updateTraderProfile({ pickup });
    });

    this.loggedInUserState$.subscribe((loggedInUser) => {
      if (loggedInUser.traderProfile.delivery !== this.delivery.value) {
        this.delivery.setValue(loggedInUser.traderProfile.delivery);
      }
      if (loggedInUser.traderProfile.pickup !== this.pickup.value) {
        this.pickup.setValue(loggedInUser.traderProfile.pickup);
      }
      if (
        !this.description.dirty &&
        loggedInUser.traderProfile.description !== this.description.value
      ) {
        this.description.setValue(loggedInUser.traderProfile.description);
        this.description.markAsPristine();
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

  async updateDescription() {
    await this.user.updateTraderProfile({
      description: this.description.value,
    });
    this.description.markAsPristine();
  }
}
