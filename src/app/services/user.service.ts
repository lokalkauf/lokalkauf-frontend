import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, combineLatest, of, from } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { TraderProfile, TraderProfileStatus } from '../models/traderProfile';
import { TraderService } from './trader.service';
import { GeoService } from './geo.service';
import { User } from 'firebase/app';
import { ImageService } from './image.service';
import { ProductService } from './product.service';

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
    private traderService: TraderService,
    private imageService: ImageService,
    private geo: GeoService,
    private productService: ProductService
  ) {
    this.isLoggedIn$ = this.auth.user.pipe(map((user) => user != null));
    this.loggedInUserState$ = this.auth.user.pipe(
      switchMap((user) =>
        user
          ? traderService.getTraderProfile(user.uid).pipe(
              map((traderProfile) => ({
                uid: user.uid,
                emailVerified: user.emailVerified,
                traderProfile,
              }))
            )
          : of(null)
      )
    );
    this.loggedInUserState$.pipe(
      map((user) => {
        if (
          user?.emailVerified &&
          user.traderProfile.status === TraderProfileStatus.CREATED
        ) {
          this.updateTraderProfile({ status: TraderProfileStatus.VERIFIED });
        }
      })
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

    await this.traderService.createTraderProfile(
      credential.user.uid,
      traderProfile
    );

    await this.geo.createLocation(
      credential.user.uid,
      traderProfile.confirmedLocation
    );

    // await this.geo.createLocationByAddress(credential.user.uid, traderProfile);
  }

  async getLoggedInUserStateOnce() {
    const ref = await this.db
      .doc(`Traders/${this.auth.auth.currentUser.uid}`)
      .ref.get();
    return ref.data();
  }

  async updateTraderProfile(partialTraderProfile: Partial<TraderProfile>) {
    this.traderService.updateTraderProfile(
      partialTraderProfile,
      this.auth.auth.currentUser.uid
    );
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
  }

  getAuthenticatedUser(): User {
    return this.auth?.auth?.currentUser;
  }

  getAuthenticatedTraderProfile(): Observable<TraderProfile> {
    const user = this.getAuthenticatedUser();

    if (user) {
      return this.traderService.getTraderProfile(user.uid);
    }

    return new Observable<TraderProfile>();
  }

  async deleteUser(password: string) {
    await this.auth.auth.signInWithEmailAndPassword(
      this.auth.auth.currentUser.email,
      password
    );
    await this.auth.auth.currentUser.delete();
  }

  getAllTraderImages() {
    return this.imageService.getAllTraderImages(this.auth.auth.currentUser.uid);
  }

  uploadTraderImage(file: File) {
    return this.imageService.uploadTraderImage(
      this.auth.auth.currentUser.uid,
      file
    );
  }

  getProducts() {
    return this.productService.getProductsOfTrader(
      this.auth.auth.currentUser.uid
    );
  }
}
