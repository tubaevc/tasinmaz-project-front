import { Injectable } from "@angular/core";
import { User } from "../login/user";
@Injectable()
export class AccountService {
  constructor() {
    this.loggedIn = localStorage.getItem("isLogged") !== null;
  }
  loggedIn = false;
  login(user: User): boolean {
    if (user.email == "admin@gmail.com" && user.password == "12345") {
      this.loggedIn = true;
      localStorage.setItem("isLogged", user.email);
      console.log("Current token:", localStorage.getItem("isLogged"));
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    this.loggedIn = localStorage.getItem("isLogged") !== null;
    return this.loggedIn;
  }
  logOut() {
    localStorage.removeItem("isLogged");
    this.loggedIn = false;
  }
}
