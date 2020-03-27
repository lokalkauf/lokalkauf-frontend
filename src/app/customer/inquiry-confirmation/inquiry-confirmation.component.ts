import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inquiry-confirmation',
  templateUrl: './inquiry-confirmation.component.html',
  styleUrls: ['./inquiry-confirmation.component.scss'],
})
export class InquiryConfirmationComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  redirectToStart() {
    this.router.navigate(['/']);
  }
}
