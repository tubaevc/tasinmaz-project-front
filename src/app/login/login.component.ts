import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  NgForm,
  Validators,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { AccountService } from "../services/account.service";
import { User } from "./user";
import { AuthService } from "../services/auth.service";
import { CustomValidators } from "../login/custom-validators";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  model: any = {};
  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]], // Email kontrolü yapılmıyor
      password: ["", [Validators.required, Validators.minLength(8)]], // Şifre kontrolü zorunlu
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    // form to model
    const loginData = {
      userEmail: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    console.log("Login data:", loginData);

    this.authService.login(loginData);
    console.log(loginData);

    // Giriş işlemi sonrası loglama
    console.log("Login email:", loginData.userEmail);
    console.log("Login password:", loginData.password);
  }
}
