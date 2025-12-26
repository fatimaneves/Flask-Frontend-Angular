import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  messageError = ''
  loginFailed = false

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    })
  }

  onSubmit(): void {
    this.loginFailed = false
    if (this.loginForm?.valid) {

      var userInfo = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      }

      this.authService.login(userInfo).subscribe(token => {
        this.tokenStorage.saveToken(token.access_token);
        this.tokenStorage.saveUser(userInfo.email);
        window.location.href = '/dashboard';
      }, err => {
        this.loginFailed = true
        this.messageError = err.error.error
      })
    }
  }

}
