import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/services/error.service';
@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
})
export class DeleteUserComponent implements OnInit {
  @Output() abortDelete = new EventEmitter();
  password = new FormControl('', Validators.required);

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async performDelete() {
    try {
      await this.userService.deleteUser(this.password.value);
      this.router.navigateByUrl('/');
    } catch (e) {
      this.errorService.publishByText(
        'Fehlgeschlagen',
        'Profil löschen fehlgeschlagen!'
      );
    }
  }

  abort() {
    this.abortDelete.emit(null);
  }
}
