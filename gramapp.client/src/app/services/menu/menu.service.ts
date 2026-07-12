import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private api: ApiService) {}
  getMenuGroups() { return this.api.getMenuGroups(); }
  createMenuGroup(dto: any) { return this.api.createMenuGroup(dto); }
  updateMenuGroup(id: number, dto: any) { return this.api.updateMenuGroup(id, dto); }
  deleteMenuGroup(id: number) { return this.api.deleteMenuGroup(id); }
  getMenus() { return this.api.getMenus(); }
  createMenu(dto: any) { return this.api.createMenu(dto); }
  updateMenu(id: number, dto: any) { return this.api.updateMenu(id, dto); }
  deleteMenu(id: number) { return this.api.deleteMenu(id); }
  getMenuAccesses() { return this.api.getMenuAccesses(); }
  createMenuAccess(dto: any) { return this.api.createMenuAccess(dto); }
  updateMenuAccess(id: number, dto: any) { return this.api.updateMenuAccess(id, dto); }
  deleteMenuAccess(id: number) { return this.api.deleteMenuAccess(id); }
}
