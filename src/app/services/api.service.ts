import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = environment.apiUrl;


  constructor(private http: HttpClient) {}

 
  getAllTasinmaz(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Tasinmaz`);
  }
}
