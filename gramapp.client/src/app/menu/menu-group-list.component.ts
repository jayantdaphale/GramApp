import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu/menu.service';

@Component({
  selector: 'app-menu-group-list',
  standalone: false,
  template: `
    <div class="master-panel">
      <div class="master-header"><div><h2>Menu Groups</h2><p>Organize application menus into navigation sections.</p></div><button (click)="openAdd()">Add Menu Group</button></div>
      <div class="master-form" *ngIf="showForm">
        <div class="form-title"><h3>{{ model.id ? 'Edit' : 'Add' }} Menu Group</h3><button class="secondary" (click)="showForm=false">Cancel</button></div>
        <div class="form-grid">
          <label><span>Name</span><input [(ngModel)]="model.name" /></label>
          <label><span>Sort order</span><input type="number" [(ngModel)]="model.sortOrder" /></label>
          <label class="check"><input type="checkbox" [(ngModel)]="model.isActive" /><span>Active</span></label>
        </div>
        <div class="form-actions"><button (click)="save()">Save</button></div>
      </div>
      <p class="error" *ngIf="error">{{ error }}</p>
      <div class="table-wrap"><table><thead><tr><th>Name</th><th>Sort</th><th>Status</th><th></th></tr></thead><tbody>
        <tr *ngFor="let item of items"><td><strong>{{item.name}}</strong></td><td>{{item.sortOrder}}</td><td>{{item.isActive ? 'Active' : 'Inactive'}}</td><td class="actions"><button class="secondary" (click)="edit(item)">Edit</button><button class="danger" (click)="remove(item.id)">Delete</button></td></tr>
      </tbody></table></div>
    </div>`,
  styleUrls: ['./menu-master.css']
})
export class MenuGroupListComponent implements OnInit {
  items: any[] = []; showForm = false; model: any = {}; error = '';
  constructor(private service: MenuService) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.service.getMenuGroups().subscribe({ next: r => this.items = r, error: () => this.error = 'Menu groups could not be loaded.' }); }
  openAdd(): void { this.model = { name: '', sortOrder: this.items.length + 1, isActive: true }; this.showForm = true; this.error = ''; }
  edit(item: any): void { this.model = { ...item }; this.showForm = true; this.error = ''; }
  save(): void {
    const request = this.model.id ? this.service.updateMenuGroup(this.model.id, this.model) : this.service.createMenuGroup(this.model);
    request.subscribe({ next: () => { this.showForm = false; this.load(); }, error: e => this.error = e.error?.message ?? 'Menu group could not be saved.' });
  }
  remove(id: number): void { if (confirm('Delete menu group?')) this.service.deleteMenuGroup(id).subscribe({ next: () => this.load(), error: e => this.error = e.error?.message ?? 'Menu group could not be deleted.' }); }
}
