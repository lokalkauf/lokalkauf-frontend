import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/services/error.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
})
export class DeleteUserComponent implements OnInit {
  password = new FormControl('', Validators.required);

  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    private userService: UserService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async performDelete() {
    try {
      await this.userService.deleteUser(this.password.value);
      this.dialogRef.close();
      this.router.navigateByUrl('/');
    } catch (e) {
      this.errorService.publishByText(
        'Fehlgeschlagen',
        'Profil löschen fehlgeschlagen!'
      );
    }
  }

  abort() {
    this.dialogRef.close();
  }
}
