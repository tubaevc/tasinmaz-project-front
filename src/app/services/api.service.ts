import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { Tasinmaz } from "src/models/tasinmaz-model";
import { catchError } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class ApiService {
  private baseUrl: string = environment.apiUrl;
  TOKEN_KEY = "token";
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
  getTasinmazlarByUser(userId: number): Observable<Tasinmaz[]> {
    return this.http.get<Tasinmaz[]>(
      `${this.baseUrl}/Tasinmaz/by-user/${userId}`
    );
  }

  addTasinmaz(tasinmaz: any): Observable<any> {
    // Token'i localStorage'dan al
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token bulunamadı. Kullanıcı oturum açmamış olabilir.");
      return throwError(
        () => new Error("Yetkilendirme hatası: Token bulunamadı.")
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
    console.log("headers", headers.keys());
    console.log("Gönderilen Taşınmaz:", tasinmaz);
    console.log("Base URL:", this.baseUrl);

    // Backend'e taşınmaz verisi gönderiliyor
    return this.http
      .post(`${this.baseUrl}/Tasinmaz/add`, tasinmaz, { headers })
      .pipe(
        catchError((error) => {
          console.error("Taşınmaz eklenirken hata oluştu:", error);
          return throwError(() => new Error("Taşınmaz ekleme başarısız."));
        })
      );
  }

  deleteMultipleTasinmaz(ids: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/Tasinmaz/multi-delete`, ids);
  }

  //guncelleme icin get metodu
  getTasinmazById(id: number): Observable<any> {
    const token = localStorage.getItem("token"); // veya token'ı sakladığınız yer
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    return this.http.get(`${this.baseUrl}/Tasinmaz/by-id/${id}`, {
      headers: headers,
    });
  }
  //guncelleme icin put metodu
  updateTasinmaz(tasinmaz: any): Observable<any> {
    const token = localStorage.getItem("token"); // veya token'ı aldığınız yer
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    return this.http.put(`${this.baseUrl}/Tasinmaz/${tasinmaz.id}`, tasinmaz, {
      headers: headers,
    });
  }
}
