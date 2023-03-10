import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private baseUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  storeIsHR(isHR: boolean) {
    localStorage.setItem('isHR', isHR.toString());
  }

  getIsHR(): boolean {
    return localStorage.getItem('isHR') === 'true';
  }

  getJwtToken(): string|null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  isAuthenticated(): boolean {
    return this.getJwtToken() ? true : false;
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem('isHR');
  }

  signup(username: string|null, email: string|null, password: string|null, token: string|null): Observable<User>{
    const url = `${this.baseUrl}/signup`
    const body = { username, email, password, token };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<User>(url, body, { headers })
  }

  login(username: string|null, email: string|null, password: string|null): Observable<User>{
    const url = `${this.baseUrl}/login`
    const body = { username, email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<User>(url, body, { headers })
  }

}
