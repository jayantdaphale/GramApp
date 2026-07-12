import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MenuService } from '../services/menu/menu.service';

@Component({
  selector: 'app-menu-list',
  standalone: false,
  template: `
    <div class="master-panel">
      <div class="master-header"><div><h2>Menus</h2><p>Define menus and their menu-group reference.</p></div><button (click)="openAdd()">Add Menu</button></div>
      <div class="master-form" *ngIf="showForm">
        <div class="form-title"><h3>{{ model.id ? 'Edit' : 'Add' }} Menu</h3><button class="secondary" (click)="showForm=false">Cancel</button></div>
        <div class="form-grid">
          <label><span>Menu group</span><select appSelect2 select2Placeholder="Select menu group" [(ngModel)]="model.menuGroupId"><option value=""></option><option *ngFor="let group of groups" [value]="group.id">{{group.name}}</option></select></label>
          <label><span>Name</span><input [(ngModel)]="model.name" /></label>
          <label><span>Code</span><input [(ngModel)]="model.code" placeholder="Unique screen code" /></label>
          <label><span>Icon</span><input [(ngModel)]="model.icon" placeholder="Emoji or short icon" /></label>
          <label><span>Sort order</span><input type="number" [(ngModel)]="model.sortOrder" /></label>
          <label class="check"><input type="checkbox" [(ngModel)]="model.isActive" /><span>Active</span></label>
        </div>
        <div class="form-actions"><button (click)="save()">Save</button></div>
      </div>
      <p class="error" *ngIf="error">{{ error }}</p>
      <div class="table-wrap"><table><thead><tr><th>Menu</th><th>Code</th><th>Group</th><th>Sort</th><th>Status</th><th></th></tr></thead><tbody>
        <tr *ngFor="let item of items"><td>{{item.icon}} <strong>{{item.name}}</strong></td><td>{{item.code}}</td><td>{{item.menuGroupName}}</td><td>{{item.sortOrder}}</td><td>{{item.isActive ? 'Active' : 'Inactive'}}</td><td class="actions"><button class="secondary" (click)="edit(item)">Edit</button><button class="danger" (click)="remove(item.id)">Delete</button></td></tr>
      </tbody></table></div>
    </div>`,
  styleUrls: ['./menu-master.css']
})
export class MenuListComponent implements OnInit {
  items: any[] = []; groups: any[] = []; showForm = false; model: any = {}; error = '';
  constructor(private service: MenuService) {}
  ngOnInit(): void { this.load(); }
  load(): void { forkJoin({ items: this.service.getMenus(), groups: this.service.getMenuGroups() }).subscribe({ next: r => { this.items = r.items; this.groups = r.groups; }, error: () => this.error = 'Menus could not be loaded.' }); }
  openAdd(): void { this.model = { menuGroupId: null, name: '', code: '', icon: '', sortOrder: this.items.length + 1, isActive: true }; this.showForm = true; this.error = ''; }
  edit(item: any): void { this.model = { ...item }; this.showForm = true; this.error = ''; }
  save(): void {
    const dto = { ...this.model, menuGroupId: Number(this.model.menuGroupId), sortOrder: Number(this.model.sortOrder) };
    const request = dto.id ? this.service.updateMenu(dto.id, dto) : this.service.createMenu(dto);
    request.subscribe({ next: () => { this.showForm = false; this.load(); }, error: e => this.error = e.error?.message ?? 'Menu could not be saved.' });
  }
  remove(id: number): void { if (confirm('Delete menu?')) this.service.deleteMenu(id).subscribe({ next: () => this.load(), error: e => this.error = e.error?.message ?? 'Menu could not be deleted.' }); }
}
