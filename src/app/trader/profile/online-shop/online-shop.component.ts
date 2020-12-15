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
    'Erstellung eines individuellen E-Menüs',
    'Online in drei Stunden',
    'Ab 0,-€ / Monat, zzgl. Transaktionsgebühren',
  ];
  wix = [
    'Einfach zu bedienen',
    'Unterschiedliche Layouts und Individualisierungsmöglichkeiten',
    'Online in wenigen Tagen',
    'Kosten ab 19,50 € / Monat, zzgl. Transaktionsgebühren',
    'Visueller Editor hilft bei der Einrichtung',
  ];
  shopify = [
    'Einfach zu bedienen',
    'Viele Einstellungs- und Individualisierungsmöglichkeiten',
    'Online in wenigen Tagen',
    'Kosten ab 29,-€ / Monat zzgl. Transaktionsgebühren',
    'Anbindung an eigene IT möglich',
    'Persönliche Unterstützung bei der Einrichtung möglich',
    'Verknüpfung mit Social Media Kanälen möglich',
    'Inkl. Analyse-Tool',
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
