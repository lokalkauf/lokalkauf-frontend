import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  user: User = new User();

  password: string;
  repeatPassword: string;

  passwordValid;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user.type = 'customer';
  }

  isValid(): boolean {
    this.passwordValid = this.password === this.repeatPassword;

    return this.passwordValid;
  }

  register() {
    if (this.isValid()) {
      this.auth.auth
        .createUserWithEmailAndPassword(this.user.email, this.password)
        .then(this.addUserData.bind(this));
    }
  }

  addUserData(addUserData: firebase.auth.UserCredential) {
    this.db
      .collection<User>('Users')
      .add({ ...this.user })
      .then(this.login.bind(this));
  }

  login(value: any) {
    this.auth.auth
      .signInWithEmailAndPassword(this.user.email, this.password)
      .then(this.saveUserCredentialAndRedirect.bind(this));
  }
  saveUserCredentialAndRedirect(userCredential: any) {
    localStorage.setItem('user-credential', JSON.stringify(userCredential));
    this.router.navigate(['/']);
  }
}
