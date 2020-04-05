import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-inquiry-confirmation',
  templateUrl: './inquiry-confirmation.component.html',
  styleUrls: ['./inquiry-confirmation.component.scss'],
})
export class InquiryConfirmationComponent implements OnInit {
  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit(): void {}

  redirectToStart() {
    const city = this.storageService.loadLocation();
    if (city) {
      this.router.navigate(['/localtraders', city.lat, city.lng]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
