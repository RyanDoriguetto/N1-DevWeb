import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.API_URL}/api/auth`;

  constructor(private http: HttpClient) {}

  login(body: { email: string; password: string }) {
    return this.http.post<{ accessToken: string; role?: string }>(`${this.base}/login`, body).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.accessToken); // <- chave usada pelo interceptor
        if (res.role) localStorage.setItem('role', res.role);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
  }

  get token(): string | null {
    return localStorage.getItem('access_token');
  }
}
