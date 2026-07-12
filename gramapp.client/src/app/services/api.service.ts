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

  getMenuGroups(page: number, pageSize: number) {
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<any>('/api/menugroups', { params });
  }
  getMenuGroupOptions() { return this.http.get<any[]>('/api/menugroups/options'); }
  createMenuGroup(dto: any) { return this.http.post('/api/menugroups', dto); }
  updateMenuGroup(id: number, dto: any) { return this.http.put(`/api/menugroups/${id}`, dto); }
  deleteMenuGroup(id: number) { return this.http.delete(`/api/menugroups/${id}`); }

  getMenus(page: number, pageSize: number) {
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<any>('/api/menus', { params });
  }
  getMenuOptions() { return this.http.get<any[]>('/api/menus/options'); }
  createMenu(dto: any) { return this.http.post('/api/menus', dto); }
  updateMenu(id: number, dto: any) { return this.http.put(`/api/menus/${id}`, dto); }
  deleteMenu(id: number) { return this.http.delete(`/api/menus/${id}`); }

  getMenuAccesses(page: number, pageSize: number) {
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<any>('/api/menuaccess', { params });
  }
  getMenuAccessOptions() { return this.http.get<any[]>('/api/menuaccess/options'); }
  createMenuAccess(dto: any) { return this.http.post('/api/menuaccess', dto); }
  updateMenuAccess(id: number, dto: any) { return this.http.put(`/api/menuaccess/${id}`, dto); }
  deleteMenuAccess(id: number) { return this.http.delete(`/api/menuaccess/${id}`); }
}
