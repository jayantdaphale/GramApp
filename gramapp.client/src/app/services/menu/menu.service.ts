import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private api: ApiService) {}
  getMenuGroups(page = 1, pageSize = 10) { return this.api.getMenuGroups(page, pageSize); }
  getMenuGroupOptions() { return this.api.getMenuGroupOptions(); }
  createMenuGroup(dto: any) { return this.api.createMenuGroup(dto); }
  updateMenuGroup(id: number, dto: any) { return this.api.updateMenuGroup(id, dto); }
  deleteMenuGroup(id: number) { return this.api.deleteMenuGroup(id); }
  getMenus(page = 1, pageSize = 10) { return this.api.getMenus(page, pageSize); }
  getMenuOptions() { return this.api.getMenuOptions(); }
  createMenu(dto: any) { return this.api.createMenu(dto); }
  updateMenu(id: number, dto: any) { return this.api.updateMenu(id, dto); }
  deleteMenu(id: number) { return this.api.deleteMenu(id); }
  getMenuAccesses(page = 1, pageSize = 10) { return this.api.getMenuAccesses(page, pageSize); }
  getMenuAccessOptions() { return this.api.getMenuAccessOptions(); }
  createMenuAccess(dto: any) { return this.api.createMenuAccess(dto); }
  updateMenuAccess(id: number, dto: any) { return this.api.updateMenuAccess(id, dto); }
  deleteMenuAccess(id: number) { return this.api.deleteMenuAccess(id); }
}
