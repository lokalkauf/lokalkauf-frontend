import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { ErrorService } from '../../../services/error.service';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
})
export class DeleteUserComponent implements OnInit {
  password = new UntypedFormControl('', Validators.required);

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
