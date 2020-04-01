import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, combineLatest, of, from } from 'rxjs';
import { map, switchMap, flatMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { TraderProfile, TraderProfileStatus } from '../models/traderProfile';
import { AngularFireStorage } from '@angular/fire/storage';
import { v4 as uuid } from 'uuid';
import { TraderService } from './trader.service';
import { GeoService } from './geo.service';
import { User } from 'firebase';

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

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private traderService: TraderService,
    private geo: GeoService
  ) {
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

    // this.db.doc(`Traders/${credential.user.uid}`).set(traderProfile);
    await this.traderService.createTraderProfile(
      credential.user.uid,
      traderProfile
    );

    await this.geo.createLocationByAddress(
      credential.user.uid,
      traderProfile.postcode
    );

    await credential.user.sendEmailVerification();
  }

  async getLoggedInUserStateOnce() {
    const ref = await this.db
      .doc(`Traders/${this.auth.auth.currentUser.uid}`)
      .ref.get();
    return ref.data();
  }

  async updateTraderProfile(partialTraderProfile: Partial<TraderProfile>) {
    console.log(partialTraderProfile);
    await this.db
      .doc<TraderProfile>(`Traders/${this.auth.auth.currentUser.uid}`)
      .update(partialTraderProfile);
  }

  uploadBusinessImage(file: File) {
    const filePath = `Traders/${
      this.auth.auth.currentUser.uid
    }/BusinessImages/${uuid()}-${file.name}`;
    return this.storage.upload(filePath, file);
  }

  async login(email: string, password: string) {
    const rmWhiteSpacesMail = email.replace(/\s/g, '');
    await this.auth.auth.signInWithEmailAndPassword(
      rmWhiteSpacesMail,
      password
    );
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

  async verifyPasswordReset(actionCode: string) {
    await this.auth.auth.checkActionCode(actionCode);
  }

  async confirmPasswordReset(actionCode: string, newPassword: string) {
    await this.auth.auth.confirmPasswordReset(actionCode, newPassword);
  }

  async revokeEmailChange(actionCode: string) {
    await this.auth.auth
      .checkActionCode(actionCode)
      .then(async (info) => await this.auth.auth.applyActionCode(actionCode));
  }

  async verifyEmail(actionCode: string) {
    await this.auth.auth.applyActionCode(actionCode);
    await this.traderService.updateTraderProfileStatus(
      this.auth.auth.currentUser.uid,
      TraderProfileStatus.VERIFIED
    );
  }

  getTraderBusinessImageThumbnails() {
    return this.auth.user.pipe(
      map((user) => user.uid),
      flatMap((traderId) =>
        from(this.traderService.getTraderBusinessImageThumbnails(traderId))
      )
    );
  }

  getTraderBusinessImages(): Observable<firebase.storage.Reference[]> {
    return this.auth.user.pipe(
      map((user) => user.uid),
      flatMap((traderId) =>
        from(this.traderService.getTraderBusinessImages(traderId))
      )
    );
  }

  getAuthenticatedUser(): User {
    if (this.auth != null && this.auth.auth != null) {
      return this.auth.auth.currentUser;
    }

    return null;
  }

  getAuthenticatedTraderProfile(): Observable<TraderProfile> {
    const user = this.getAuthenticatedUser();

    if (user) {
      return this.traderService.getTraderProfile(user.uid);
    }

    return new Observable<TraderProfile>();
  }
}
