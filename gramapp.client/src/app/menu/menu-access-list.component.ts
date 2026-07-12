import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { normalizePagedResult } from '../services/paged-result';
import { MenuService } from '../services/menu/menu.service';

@Component({
  selector: 'app-menu-access-list',
  standalone: false,
  template: `
    <div class="master-panel">
      <div class="master-header"><div><h2>Menu Access</h2><p>{{ totalCount }} menu access records available</p></div><button (click)="openAdd()">Add Menu Access</button></div>
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
      <p class="state-message" *ngIf="isLoading">Loading menu access profiles...</p>
      <p class="error" *ngIf="!isLoading && error">{{ error }}</p>
      <p class="state-message" *ngIf="!isLoading && !error && items.length === 0">No menu access profiles found.</p>
      <div class="table-wrap" *ngIf="!isLoading && !error && items.length > 0"><table><thead><tr><th>Access profile</th><th>Selected menus</th><th>Status</th><th></th></tr></thead><tbody>
        <tr *ngFor="let item of items"><td><strong>{{item.name}}</strong></td><td>{{item.menuIds.length}}</td><td>{{item.isActive ? 'Active' : 'Inactive'}}</td><td class="actions"><button class="secondary" (click)="edit(item)">Edit</button><button class="danger" (click)="remove(item.id)">Delete</button></td></tr>
      </tbody></table></div>
      <div class="pager" *ngIf="!isLoading && !error"><button type="button" (click)="prev()" [disabled]="page === 1">Prev</button><span>Page {{ page }} of {{ totalPages }}</span><button type="button" (click)="next()" [disabled]="page >= totalPages">Next</button></div>
    </div>`,
  styleUrls: ['./menu-master.css']
})
export class MenuAccessListComponent implements OnInit {
  items: any[] = []; menus: any[] = []; showForm = false; model: any = {}; error = '';
  page = 1; pageSize = 10; totalCount = 0; isLoading = false;
  constructor(private service: MenuService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.isLoading = true; this.error = '';
    forkJoin({ items: this.service.getMenuAccesses(this.page, this.pageSize), menus: this.service.getMenuOptions() })
      .pipe(finalize(() => { this.isLoading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: r => {
          const result = normalizePagedResult(r.items);
          this.totalCount = result.totalCount;
          if (this.page > this.totalPages) { this.page = this.totalPages; this.load(); return; }
          this.items = result.items; this.menus = r.menus;
        },
        error: () => { this.items = []; this.menus = []; this.totalCount = 0; this.error = 'Menu access profiles could not be loaded.'; }
      });
  }
  prev(): void { if (this.page > 1) { this.page--; this.load(); } }
  next(): void { if (this.page < this.totalPages) { this.page++; this.load(); } }
  get totalPages(): number { return Math.max(1, Math.ceil(this.totalCount / this.pageSize)); }
  get groupedMenus(): { name: string; menus: any[] }[] { const map = new Map<string, any[]>(); this.menus.forEach(menu => map.set(menu.menuGroupName, [...(map.get(menu.menuGroupName) ?? []), menu])); return [...map].map(([name, menus]) => ({ name, menus })); }
  openAdd(): void { this.model = { name: '', isActive: true, menuIds: [] }; this.showForm = true; this.error = ''; }
  edit(item: any): void { this.model = { ...item, menuIds: item.menuIds.map((id: unknown) => Number(id)) }; this.showForm = true; this.error = ''; }
  isSelected(id: number): boolean { return this.model.menuIds?.includes(id); }
  toggleMenu(id: number, checked: boolean): void { const ids = new Set<number>(this.model.menuIds ?? []); checked ? ids.add(id) : ids.delete(id); this.model.menuIds = [...ids]; }
  isGroupSelected(menus: any[]): boolean { return menus.length > 0 && menus.every(menu => this.isSelected(menu.id)); }
  toggleGroup(menus: any[], checked: boolean): void { menus.forEach(menu => this.toggleMenu(menu.id, checked)); }
  save(): void { const request = this.model.id ? this.service.updateMenuAccess(this.model.id, this.model) : this.service.createMenuAccess(this.model); request.pipe(finalize(() => this.cdr.detectChanges())).subscribe({ next: () => { this.showForm = false; this.load(); }, error: e => this.error = e.error?.message ?? 'Menu access profile could not be saved.' }); }
  remove(id: number): void { if (confirm('Delete menu access profile?')) this.service.deleteMenuAccess(id).pipe(finalize(() => this.cdr.detectChanges())).subscribe({ next: () => this.load(), error: e => this.error = e.error?.message ?? 'Menu access profile could not be deleted.' }); }
}
