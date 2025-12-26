import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './service/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/services/auth.service';

interface User {
  _id: {
    $oid: string
  },
  email: string,
  is_admin: boolean,
  name: string
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userInfo: User
  changePasswordForm: FormGroup

  constructor(
    private usersService: UserService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUserInfById()
    this.changePasswordForm = new FormGroup({
      new_password: new FormControl(null, [Validators.required])
    })
  }

  getUserInfById(): void {
    this.usersService.getUserById(this.route.snapshot.paramMap.get('id')!).subscribe(data => {
      this.userInfo = data
    })
  }

  deleteUser(): void {
    this.usersService.deleteUserById(this.route.snapshot.paramMap.get('id')!).subscribe(data => {
      this.toastr.success('Utilizador apagado com sucesso', this.userInfo.name + " : " + this.userInfo._id.$oid);

      window.location.href = '/dashboard';
    })
  }

  onChangePassword(): void {
    if (this.changePasswordForm.valid) {
      this.authService.changePassword(this.route.snapshot.paramMap.get('id')!, this.changePasswordForm.value).subscribe(data => {
        this.toastr.success('Password alterada com sucesso', this.userInfo.name);
        this.changePasswordForm.reset()
      },err => {
        this.toastr.error(err.error.error);
      })
    }

  }
}
