import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginUser } from "src/models/loginUser";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}
  path = "https://localhost:44316/api/auth/";
  userToken: any;
  // login(loginUser: LoginUser) {
  //   let headers = new HttpHeaders();
  //   headers = headers.append("Content-Type", "application/json");
  //   this.httpClient
  //     .post(this.path + "login", loginUser, { headers: headers })
  //     .subscribe(data => {this.saveToken(data['tokenString'])
  //       this.userToken = data['tokenString'];

  //      }),
  // }
  saveToken(token: string) {
    localStorage.setItem("token", token);
  }
}
