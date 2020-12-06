import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoggedInUserState, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'lk-online-shop',
  templateUrl: './online-shop.component.html',
  styleUrls: ['./online-shop.component.scss'],
})
export class OnlineShopComponent implements OnInit {
  @Input() loggedInUserState: LoggedInUserState;
  saveSuccessful = false;

  sotrusty = [
    'Einfach zu bedienen',
    'Online Bezahlung',
    'Online in drei Stunden',
    'Ab 0,-€ / Monat',
  ];
  wix = [
    'Einfach zu bedienen',
    'Online Bezahlung',
    'Online in wenigen Tagen',
    'Visueller Editor',
    'Ab 16,-€ / Monat',
  ];
  shopify = [
    'Sehr viele Einstellungen',
    'Online Bezahlung',
    'Mächtiger Onlineshop',
    'Anbindung an eigene IT möglich',
    'Viele Designvorlagen',
    'Einrichtung in wenigen Wochen',
    'Ab 9,-€ / Monat',
  ];

  onlineshopForm = new FormGroup({
    eigenershop: new FormControl('', [Validators.required]),
  });

  constructor(private user: UserService) {}

  ngOnInit(): void {
    this.eigenershop.setValue(this.loggedInUserState.traderProfile.onlineshop, {
      emitEvent: false,
    });
    this.onlineshopForm.markAsPristine();
  }

  get eigenershop() {
    return this.onlineshopForm.get('eigenershop');
  }

  async onSubmit() {
    if (this.onlineshopForm.invalid) {
      return;
    }
    await this.user.updateTraderProfile({
      onlineshop: this.eigenershop.value || null,
    });

    this.onlineshopForm.markAsPristine();

    this.saveSuccessful = true;
    setTimeout(() => {
      this.saveSuccessful = false;
    }, 15000);
  }

  open(what: string) {
    let url = 'https://sotrusty.com';
    switch (what) {
      case 'w':
        url = 'https://www.wix.com/html5ecom/tae-store';
        break;
      case 's':
        url = 'https://www.shopify.de/';
        break;
      default:
        break;
    }
    window.open(url, '_blank');
  }
}
