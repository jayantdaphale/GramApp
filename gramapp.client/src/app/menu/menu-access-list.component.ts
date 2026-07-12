import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MenuService } from '../services/menu/menu.service';

@Component({
  selector: 'app-menu-access-list',
  standalone: false,
  template: `
    <div class="master-panel">
      <div class="master-header"><div><h2>Menu Access</h2><p>Create reusable access profiles by selecting menus within each group.</p></div><button (click)="openAdd()">Add Menu Access</button></div>
      <div class="master-form" *ngIf="showForm">
        <div class="form-title"><h3>{{ model.id ? 'Edit' : 'Add' }} Menu Access</h3><button class="secondary" (click)="showForm=false">Cancel</button></div>
        <div class="form-grid"><label><span>Access name</span><input [(ngModel)]="model.name" /></label><label class="check"><input type="checkbox" [(ngModel)]="model.isActive" /><span>Active</span></label></div>
        <div class="access-groups">
          <section *ngFor="let group of groupedMenus"><div class="access-group-title"><strong>{{group.name}}</strong><label class="check"><input type="checkbox" [checked]="isGroupSelected(group.menus)" (change)="toggleGroup(group.menus, $any($event.target).checked)" /><span>Select all</span></label></div>
            <label class="menu-check" *ngFor="let menu of group.menus"><input type="checkbox" [checked]="isSelected(menu.id)" (change)="toggleMenu(menu.id, $any($event.target).checked)" /><span>{{menu.icon}} {{menu.name}}</span></label>
          </section>
        </div>
        <div class="form-actions"><button (click)="save()">Save</button></div>
      </div>
      <p class="error" *ngIf="error">{{ error }}</p>
      <div class="table-wrap"><table><thead><tr><th>Access profile</th><th>Selected menus</th><th>Status</th><th></th></tr></thead><tbody>
        <tr *ngFor="let item of items"><td><strong>{{item.name}}</strong></td><td>{{item.menuIds.length}}</td><td>{{item.isActive ? 'Active' : 'Inactive'}}</td><td class="actions"><button class="secondary" (click)="edit(item)">Edit</button><button class="danger" (click)="remove(item.id)">Delete</button></td></tr>
      </tbody></table></div>
    </div>`,
  styleUrls: ['./menu-master.css']
})
export class MenuAccessListComponent implements OnInit {
  items: any[] = []; menus: any[] = []; showForm = false; model: any = {}; error = '';
  constructor(private service: MenuService) {}
  ngOnInit(): void { this.load(); }
  load(): void { forkJoin({ items: this.service.getMenuAccesses(), menus: this.service.getMenus() }).subscribe({ next: r => { this.items = r.items; this.menus = r.menus; }, error: () => this.error = 'Menu access profiles could not be loaded.' }); }
  get groupedMenus(): { name: string; menus: any[] }[] { const map = new Map<string, any[]>(); this.menus.forEach(menu => map.set(menu.menuGroupName, [...(map.get(menu.menuGroupName) ?? []), menu])); return [...map].map(([name, menus]) => ({ name, menus })); }
  openAdd(): void { this.model = { name: '', isActive: true, menuIds: [] }; this.showForm = true; this.error = ''; }
  edit(item: any): void { this.model = { ...item, menuIds: [...item.menuIds] }; this.showForm = true; this.error = ''; }
  isSelected(id: number): boolean { return this.model.menuIds?.includes(id); }
  toggleMenu(id: number, checked: boolean): void { const ids = new Set<number>(this.model.menuIds ?? []); checked ? ids.add(id) : ids.delete(id); this.model.menuIds = [...ids]; }
  isGroupSelected(menus: any[]): boolean { return menus.length > 0 && menus.every(menu => this.isSelected(menu.id)); }
  toggleGroup(menus: any[], checked: boolean): void { menus.forEach(menu => this.toggleMenu(menu.id, checked)); }
  save(): void { const request = this.model.id ? this.service.updateMenuAccess(this.model.id, this.model) : this.service.createMenuAccess(this.model); request.subscribe({ next: () => { this.showForm = false; this.load(); }, error: e => this.error = e.error?.message ?? 'Menu access profile could not be saved.' }); }
  remove(id: number): void { if (confirm('Delete menu access profile?')) this.service.deleteMenuAccess(id).subscribe({ next: () => this.load(), error: e => this.error = e.error?.message ?? 'Menu access profile could not be deleted.' }); }
}
