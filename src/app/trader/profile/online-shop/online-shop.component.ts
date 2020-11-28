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
    await this.user.updateTraderProfile({
      onlineshop: this.eigenershop.value || null,
    });

    this.onlineshopForm.markAsPristine();

    this.saveSuccessful = true;
    setTimeout(() => {
      this.saveSuccessful = false;
    }, 15000);
  }
}
