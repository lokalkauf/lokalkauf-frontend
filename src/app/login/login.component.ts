import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.auth.auth.signInWithEmailAndPassword(this.email, this.password).then(this.saveUserCredentialAndRedirect.bind(this));
  }
  saveUserCredentialAndRedirect(userCredential: any){
    localStorage.setItem('user-credential', JSON.stringify(userCredential));
    this.router.navigate(['/']);
  }

}
