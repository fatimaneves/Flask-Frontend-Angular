import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';


interface IAuth {
  name?: string,
  email?: string,
  password?: string,
  new_password?: string
}

const AUTH_API = 'http://localhost:5000/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private token: TokenStorageService) { }

  login(data: IAuth): Observable<any> {
    return this.http.post(AUTH_API + 'auth/login/', data, httpOptions);
  }

  register(data: IAuth): Observable<any> {
    const token = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ` + token
      })
    };
    return this.http.post(AUTH_API + 'auth/register/', data, httpOptions);
  }

  changePassword(id: string, data: IAuth): Observable<any> {
    const token = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ` + token
      })
    };
    return this.http.post(AUTH_API + 'auth/changepassword/' + id + '/', data, httpOptions);
  }
}
