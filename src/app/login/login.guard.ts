import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AccountService } from "../services/account.service";
import { AuthService } from "../services/auth.service";
@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot, //gitmek istedigi yer
    state: RouterStateSnapshot //bulundugu yer
  ): boolean {
    let logged = this.authService.loggedIn();
    if (!logged) {
      this.router.navigate(["login"]);
    }
    return logged;
  }
}
