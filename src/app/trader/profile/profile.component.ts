import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  user$: Observable<User>;

  constructor(private auth: AngularFireAuth, private router: Router) {
    this.user$ = auth.user;
  }

  async resendEmailVerification(user: User) {
    await user.sendEmailVerification();
    // TODO: Inform user
  }

  async logout() {
    await this.auth.auth.signOut();
    this.router.navigateByUrl('/');
  }

}
