import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLoggedIn$: Observable<boolean>;

  constructor(private auth: AngularFireAuth) {
    this.isLoggedIn$ = this.auth.user.pipe(map((user) => user != null));
  }

  async register(email: string, password: string) {
    const credential = await this.auth.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    await credential.user.sendEmailVerification();
  }

  async login(email: string, password: string) {
    await this.auth.auth.signInWithEmailAndPassword(email, password);
  }
}
