import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from 'src/app/auth/services/token-storage.service';

const AUTH_API = 'http://localhost:5000/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private token: TokenStorageService
  ) { }

  getAllUsers(): Observable<any> {
    const token = this.token.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    })
    return this.http.get(AUTH_API + 'users/', { headers: headers });
  }

  getUserById(userId: string): Observable<any> {
    const token = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ` + token
      })
    };

    return this.http.get<any>(AUTH_API + 'users/'+ userId + "/", httpOptions);
  }

  deleteUserById(userId: string): Observable<any> {
    const token = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ` + token
      })
    };

    return this.http.delete(AUTH_API + 'users/'+ userId + "/", httpOptions);
  }
}