import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { normalizePagedResult } from '../services/paged-result';
import { MenuService } from '../services/menu/menu.service';

@Component({
  selector: 'app-menu-list',
  standalone: false,
  template: `
    <div class="master-panel">
      <div class="master-header"><div><h2>Menus</h2><p>{{ totalCount }} menu records available</p></div><button (click)="openAdd()">Add Menu</button></div>
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
      <p class="state-message" *ngIf="isLoading">Loading menus...</p>
      <p class="error" *ngIf="!isLoading && error">{{ error }}</p>
      <p class="state-message" *ngIf="!isLoading && !error && items.length === 0">No menus found.</p>
      <div class="table-wrap" *ngIf="!isLoading && !error && items.length > 0"><table><thead><tr><th>Menu</th><th>Code</th><th>Group</th><th>Sort</th><th>Status</th><th></th></tr></thead><tbody>
        <tr *ngFor="let item of items"><td>{{item.icon}} <strong>{{item.name}}</strong></td><td>{{item.code}}</td><td>{{item.menuGroupName}}</td><td>{{item.sortOrder}}</td><td>{{item.isActive ? 'Active' : 'Inactive'}}</td><td class="actions"><button class="secondary" (click)="edit(item)">Edit</button><button class="danger" (click)="remove(item.id)">Delete</button></td></tr>
      </tbody></table></div>
      <div class="pager" *ngIf="!isLoading && !error"><button type="button" (click)="prev()" [disabled]="page === 1">Prev</button><span>Page {{ page }} of {{ totalPages }}</span><button type="button" (click)="next()" [disabled]="page >= totalPages">Next</button></div>
    </div>`,
  styleUrls: ['./menu-master.css']
})
export class MenuListComponent implements OnInit {
  items: any[] = []; groups: any[] = []; showForm = false; model: any = {}; error = '';
  page = 1; pageSize = 10; totalCount = 0; isLoading = false;
  constructor(private service: MenuService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.isLoading = true; this.error = '';
    forkJoin({ items: this.service.getMenus(this.page, this.pageSize), groups: this.service.getMenuGroupOptions() })
      .pipe(finalize(() => { this.isLoading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: r => {
          const result = normalizePagedResult(r.items);
          this.totalCount = result.totalCount;
          if (this.page > this.totalPages) { this.page = this.totalPages; this.load(); return; }
          this.items = result.items; this.groups = r.groups;
        },
        error: () => { this.items = []; this.groups = []; this.totalCount = 0; this.error = 'Menus could not be loaded.'; }
      });
  }
  prev(): void { if (this.page > 1) { this.page--; this.load(); } }
  next(): void { if (this.page < this.totalPages) { this.page++; this.load(); } }
  get totalPages(): number { return Math.max(1, Math.ceil(this.totalCount / this.pageSize)); }
  openAdd(): void { this.model = { menuGroupId: null, name: '', code: '', icon: '', sortOrder: this.totalCount + 1, isActive: true }; this.showForm = true; this.error = ''; }
  edit(item: any): void { this.model = { ...item, menuGroupId: Number(item.menuGroupId) }; this.showForm = true; this.error = ''; }
  save(): void {
    const dto = { ...this.model, menuGroupId: Number(this.model.menuGroupId), sortOrder: Number(this.model.sortOrder) };
    const request = dto.id ? this.service.updateMenu(dto.id, dto) : this.service.createMenu(dto);
    request.pipe(finalize(() => this.cdr.detectChanges())).subscribe({ next: () => { this.showForm = false; this.load(); }, error: e => this.error = e.error?.message ?? 'Menu could not be saved.' });
  }
  remove(id: number): void { if (confirm('Delete menu?')) this.service.deleteMenu(id).pipe(finalize(() => this.cdr.detectChanges())).subscribe({ next: () => this.load(), error: e => this.error = e.error?.message ?? 'Menu could not be deleted.' }); }
}
