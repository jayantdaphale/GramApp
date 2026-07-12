import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface NavigationMenu {
  id: number;
  name: string;
  code: string;
  icon?: string;
  sortOrder: number;
  menuGroupId: number;
  menuGroupName: string;
  menuGroupSortOrder: number;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  companyId: number;
  isSuperAdmin: boolean;
  menus: NavigationMenu[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth$ = new BehaviorSubject<AuthResponse | null>(null);

  constructor(private http: HttpClient) {
    const raw = localStorage.getItem('auth');
    if (raw) this.auth$.next(JSON.parse(raw));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password }).pipe(
      tap(res => this.setAuth(res))
    );
  }

  refresh(refreshToken: string) {
    return this.http.post<AuthResponse>('/api/auth/refresh', { refreshToken }).pipe(
      tap(res => this.setAuth(res))
    );
  }

  loadCurrentMenus() {
    return this.http.get<NavigationMenu[]>('/api/menuaccess/current').pipe(
      tap(menus => {
        const current = this.auth$.value;
        if (current) this.setAuth({ ...current, menus });
      })
    );
  }

  private setAuth(res: AuthResponse | null) {
    if (res) {
      localStorage.setItem('auth', JSON.stringify(res));
      this.auth$.next(res);
    } else {
      localStorage.removeItem('auth');
      this.auth$.next(null);
    }
  }

  get accessToken() { return this.auth$.value?.accessToken ?? null; }
  get refreshToken() { return this.auth$.value?.refreshToken ?? null; }
  get currentUser() { return this.auth$.value; }
  isAuthenticated() { return !!this.auth$.value; }

  logout() { this.setAuth(null); }
}
