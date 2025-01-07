import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "https://localhost:44316/api/User";

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  addUser(user: any): Observable<any> {
    console.log("user sent to backend:", JSON.stringify(user));
    return this.http.post(this.apiUrl, user);
  }

  updateUser(userId: number, user: any) {
    return this.http.put(`${this.apiUrl}/${userId}`, user);
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
