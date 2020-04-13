import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

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
      this.router.navigate([
        '/localtraders',
        city.coordinates[0],
        city.coordinates[1],
        city.radius ? city.radius : 10,
      ]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
