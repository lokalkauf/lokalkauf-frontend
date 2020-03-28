import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { Trader } from '../../models/trader';
import { EMail } from '../../models/email';
import {EMailService} from "../../services/email.service";


@Component({
  selector: 'app-trader-email',
  templateUrl: './trader-email.component.html',
  styleUrls: ['./trader-email.component.scss'],
  providers:  [ EMailService ]
})
export class TraderEmailComponent implements OnInit {

  @Input() trader: Trader;

  mailModel = new EMail();
  submitted = false;
  error: {};

  constructor(private router: Router,
              private mailService: EMailService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitted = true;
    // TODO finalize call for backend sending mail
    // return this.mailService.contactForm(this.mailModel)
    //   .send(
    //   data => this.mailModel = data,
    //   error => this.error = error
    // );
  }

  gotoHome() {
    this.router.navigate(['/']);
  }

}
