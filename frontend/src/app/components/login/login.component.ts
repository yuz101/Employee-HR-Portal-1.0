import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserAction } from 'src/app/store/actions/user.action';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  constructor(
    private authService: AuthService, 
    private _router: Router, 
    private store: Store
  ) { }
  
  form = new FormBuilder().group({
    username: '',
    email: '',
    password: '',
  });

  login() {
    const {username, email, password} = { ...this.form.getRawValue() };
    this.authService.login(username, email, password).subscribe({
      next: (user: User) => {
        this.authService.storeJwtToken(user.jwt!);
        this.authService.storeIsHR(user.isHR!);
        console.log(user);
        if(user.isHR) {
          this._router.navigateByUrl('registration-emails');
        } else {
          this._router.navigateByUrl('/onboarding');
        }
      }, error: (error) => {
        console.log(error);
      }
    })
  }
}
