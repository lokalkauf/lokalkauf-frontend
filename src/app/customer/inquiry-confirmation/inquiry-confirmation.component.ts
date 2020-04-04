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
    const city = localStorage.getItem('city') as any;
    console.log('kk', city);
    if (city) {
      const deserCity = JSON.parse(city);
      this.router.navigate(['/localtraders', deserCity.lat, deserCity.lng]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
