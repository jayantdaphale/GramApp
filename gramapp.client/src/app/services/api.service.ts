import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getCompanies(page: number, pageSize: number) {
    let params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<any>('/api/companies', { params });
  }

  createCompany(dto: any) {
    return this.http.post('/api/companies', dto);
  }

  updateCompany(id: number, dto: any) {
    return this.http.put(`/api/companies/${id}`, dto);
  }

  deleteCompany(id: number) {
    return this.http.delete(`/api/companies/${id}`);
  }

  getUsers(page: number, pageSize: number) {
    let params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<any>('/api/users', { params });
  }

  createUser(dto: any) {
    return this.http.post('/api/users', dto);
  }

  updateUser(id: string, dto: any) {
    return this.http.put(`/api/users/${id}`, dto);
  }

  deleteUser(id: string) {
    return this.http.delete(`/api/users/${id}`);
  }
}
