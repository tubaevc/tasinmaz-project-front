import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "src/environments/environment";
import { Log } from "src/models/logModel";

@Injectable({
  providedIn: "root",
})
export class LogService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.baseUrl}/Log`);
  }
}
