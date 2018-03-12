import { Component } from '@angular/core';
import {
  Alert, AlertController,  Loading, LoadingController, NavController
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { FormControl } from '@angular/forms';
import { SignupPage } from '../signup/signup';
import { ResetPasswordPage } from '../reset-password/reset-password';
export class EmailValidator {
  static isValid(control: FormControl) {
    const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
      control.value);
    if (re) {
      return null;
    }
    return {
      invalidEmail: true
    };
  }
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public loginForm: FormGroup;
  public loading: Loading;
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public authProvider: AuthProvider, formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email: ['',
        Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['',
        Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  loginUser(): void {
    if (!this.loginForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.loginForm.value}`
      );
    } else {
      const email = this.loginForm.value.email; const password = this.loginForm.value.password;
      this.authProvider.loginUser(email, password).then(authData => {
        this.loading.dismiss().then(() => {
          this.navCtrl.setRoot(HomePage);
        });
      },
        error => {
          this.loading.dismiss().then(() => {
            const alert: Alert = this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            alert.present();
          });
        });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }

  goToSignup(): void {
    this.navCtrl.push(SignupPage);
  }

  goToResetPassword(): void {
    this.navCtrl.push(ResetPasswordPage);
  }

}
