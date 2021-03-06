import { Component } from '@angular/core';
import {
  Alert, AlertController,  Loading, LoadingController, NavController
} from "ionic-angular";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { HomePage } from "../home/home";

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
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
    public signupForm: FormGroup; public loading: Loading;
  constructor(
    public navCtrl: NavController, public authProvider: AuthProvider,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, formBuilder: FormBuilder
  ) {
    this.signupForm = formBuilder.group({
      email: ["",
        Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ["",
        Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }
  signupUser(): void {
    if (!this.signupForm.valid) {
      console.log(
        `Need to complete the form, current value: ${this.signupForm.value}`
      );
    } else {
      const email: string = this.signupForm.value.email; const password: string = this.signupForm.value.password;
      this.authProvider.signupUser(email, password).then(user => {
        this.loading.dismiss().then(() => {
          this.navCtrl.setRoot(HomePage);
        });
      },
        error => {
          this.loading.dismiss().then(() => {
            const alert: Alert = this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: "Ok", role: "cancel" }]
            });
            alert.present();
          });
        });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }
}
