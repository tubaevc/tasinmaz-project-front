import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginUser } from "src/models/loginUser";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Route, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) {}
  path = "https://localhost:44316/api/Auth/";
  userToken: any;
  decidedToken: any;
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY = "token";
  private baseUrl: string = environment.apiUrl;

  login(loginData: any): void {
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    this.httpClient.post(this.path + "login", loginData, { headers }).subscribe(
      (data: any) => {
        // backend yaniti
        console.log("Login successful:", data);

        if (data.token) {
          localStorage.setItem("token", data.token);
        } else {
          console.error("Token missing in response");
        }

        this.router.navigateByUrl("/");
      },
      (error) => {
        console.error("Login failed:", error);
      }
    );
  }

  saveToken(token: string) {
    console.log("Saving token: ", token);
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  loggedIn() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUserId() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token ? this.jwtHelper.decodeToken(token).nameid : null;
  }

  getRole(): string | null {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken && decodedToken.role ? decodedToken.role : null;
  }
  isAdmin(): boolean {
    const role = this.getRole();
    return role === "admin" || role === "Admin";
  }
}
