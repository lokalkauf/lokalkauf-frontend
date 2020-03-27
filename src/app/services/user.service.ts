import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { TraderProfile } from '../models/traderProfile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLoggedIn$: Observable<boolean>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.isLoggedIn$ = this.auth.user.pipe(map((user) => user != null));
  }

  async register(
    email: string,
    password: string,
    traderProfile: TraderProfile
  ) {
    const credential = await this.auth.auth.createUserWithEmailAndPassword(
      email,
      password
    );

    await this.db.doc(`Traders/${credential.user.uid}`).set(traderProfile);

    await credential.user.sendEmailVerification();
  }

  async login(email: string, password: string) {
    await this.auth.auth.signInWithEmailAndPassword(email, password);
  }
}
