import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { TraderProfile } from '../models/traderProfile';

export interface LoggedInUserState {
  uid: string;
  emailVerified: boolean;
  traderProfile: TraderProfile;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isLoggedIn$: Observable<boolean>;
  loggedInUserState$: Observable<LoggedInUserState | null>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.isLoggedIn$ = this.auth.user.pipe(map((user) => user != null));
    this.loggedInUserState$ = this.auth.user.pipe(
      map((user) => ({
        uid: user.uid,
        emailVerified: user.emailVerified,
      })),
      switchMap((partialData) =>
        combineLatest([
          of(partialData),
          db
            .doc<TraderProfile>(`Traders/${partialData.uid}`)
            .valueChanges()
            .pipe(
              map((traderProfile) => ({
                ...traderProfile,
                id: partialData.uid,
              }))
            ),
        ])
      ),
      map(([partialData, traderProfile]) => ({ ...partialData, traderProfile }))
    );
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

  async updateTraderProfile(partialTraderProfile: Partial<TraderProfile>) {
    console.log(partialTraderProfile);
    await this.db
      .doc<TraderProfile>(`Traders/${this.auth.auth.currentUser.uid}`)
      .update(partialTraderProfile);
  }

  async login(email: string, password: string) {
    await this.auth.auth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    await this.auth.auth.signOut();
  }

  async sendPasswordResetEmail(email: string) {
    await this.auth.auth.sendPasswordResetEmail(email);
  }

  async resendEmailVerification() {
    await this.auth.auth.currentUser.sendEmailVerification();
  }

  async revokeEmailChange(actionCode: string) {
    await this.auth.auth
      .checkActionCode(actionCode)
      .then((info) => this.auth.auth.applyActionCode(actionCode))
      .catch((error) => console.log('Error occured : ' + error.message));
  }

  async verifyEmail(actionCode: string) {
    await this.auth.auth
      .applyActionCode(actionCode)
      .catch((error) => console.log('Error occured : ' + error.message));
  }
}
