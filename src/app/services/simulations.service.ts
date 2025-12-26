import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { TokenStorageService } from '../auth/services/token-storage.service';

interface simulation {
  _id: {
    $oid: string
  },
  jobs?: {},
  n_jobs: number,
  n_machines: number,
  n_operations: number
}

const AUTH_API = 'http://localhost:5000/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class SimulationsService {

  constructor(
    private http: HttpClient,
    private token: TokenStorageService) { }

  getAllSimulations(): Observable<any> {
    return this.http.get<simulation>(AUTH_API + 'simulations/', httpOptions);
  }

  getSimulationById(id: string): Observable<any> {
    const token = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ` + token
      })
    };
    return this.http.get(AUTH_API + 'simulations/' + id + "/", httpOptions);
  }

  createSimulation(data: any): Observable<any> {
    const token = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ` + token
      })
    };
    return this.http.post(AUTH_API + 'simulations/', data, httpOptions);
  }

  deleteSimulationById(id: string): Observable<any> {
    const token = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ` + token
      })
    };
    return this.http.delete(AUTH_API + 'simulations/' + id + "/", httpOptions);
  }

  getGooleSimulation(id: string): Observable<any> {
    const token = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ` + token
      })
    };
    return this.http.get(AUTH_API + 'simulations/' + id + "/google/", httpOptions);
  }

  getGooleSimulationDownload(id: string): Observable<any> {
    const token = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ` + token
      })
    };
    return this.http.get(AUTH_API + 'simulations/' + id + "/google/download", httpOptions)
  }

  updateJobInSimulation(id: string, data: any): Observable<any> {
    const token = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ` + token
      })
    };
    return this.http.put(AUTH_API + 'simulations/' + id + "/jobs/", data, httpOptions)
  }
}
