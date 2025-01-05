import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tasinmaz } from 'src/models/tasinmaz-model';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = environment.apiUrl;


  constructor(private http: HttpClient) {}

 
  getAllTasinmaz(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Tasinmaz`);
  }
  getIller(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Iller`);
  }

  getIlceler(ilId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Ilce/by-il/${ilId}`);
  }

  getMahalleler(ilceId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Mahalle/by-ilce/${ilceId}`);
  }

  addTasinmaz(tasinmaz: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Tasinmaz`, tasinmaz);
  }

  deleteMultipleTasinmaz(ids: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/Tasinmaz/multi-delete`, ids);
  }
  
  //guncelleme icin get metodu
  getTasinmazById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Tasinmaz/${id}`);
  }
  //guncelleme icin put metodu
  updateTasinmaz(tasinmaz: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/Tasinmaz/${tasinmaz.id}`, tasinmaz);
  }
 
}
